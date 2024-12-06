import { StatusDto, StatusQueueDto, UserDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import {
  BatchWriteItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStatusDAO extends DynamoDAO implements StatusDAO {
  private statusTableName = "Status";
  async postStatus(newStatus: StatusDto): Promise<void> {
    const putItemParams = {
      TableName: this.statusTableName,
      Item: {
        alias: { S: newStatus.user.alias }, // Partition Key
        timestamp: { N: newStatus.timestamp.toString() }, // Sort Key
        post: { S: newStatus.post }, // Post Content
      },
    };

    try {
      await this.dynamoClient.send(new PutItemCommand(putItemParams));
      console.log(`Post added for user ${newStatus.user}`);
    } catch (error) {
      console.error("Error posting status:", error);
      throw error;
    }
  }

  async loadMorePosts(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    type: "Status" | "Feed"
  ): Promise<[StatusDto[], boolean]> {
    const queryParams = {
      TableName: type,
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": { S: userAlias },
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? {
            alias: { S: userAlias },
            timestamp: { N: lastItem.timestamp.toString() },
          }
        : undefined,
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );

      if (!result.Items) {
        return [[], false];
      }

      const users: UserDto[] = [];

      for (let item of result.Items) {
        let user = null;
        if (type == "Feed") {
          user = await this.getUser(item.authorAlias.S!);
        } else {
          user = await this.getUser(item.alias.S!);
        }

        if (user) {
          users.push(user);
        }
      }

      const posts = result.Items?.map((item, index) => ({
        post: item.post.S!,
        user: users[index],
        timestamp: Number(item.timestamp.N!),
      })) as StatusDto[];

      const hasMore = !!result.LastEvaluatedKey;

      return [posts, hasMore];
    } catch (error) {
      console.error(`Error loading ${type} items:`, error);
      throw error;
    }
  }

  async loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMorePosts(userAlias, pageSize, lastItem, "Feed");
  }

  async loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMorePosts(userAlias, pageSize, lastItem, "Status");
  }

  async populateFeed(
    followers: string[],
    status: StatusQueueDto
  ): Promise<void> {
    try {
      const writeRequests = followers.map((alias) => ({
        PutRequest: {
          Item: {
            alias: { S: alias }, // Follower's feed
            timestamp: { N: status.timestamp.toString() },
            post: { S: status.post },
            authorAlias: { S: status.author }, // The user who made the post
          },
        },
      }));

      const batchWriteParams = {
        RequestItems: {
          Feed: writeRequests,
        },
      };

      await this.dynamoClient.send(new BatchWriteItemCommand(batchWriteParams));
    } catch (error) {
      console.error(`Error populating feeds for ${status}:`, error);
      throw error;
    }
  }
}
