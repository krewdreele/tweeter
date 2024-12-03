import { BatchWriteItemCommand, DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { StatusDto, UserDto } from "tweeter-shared";

export abstract class DynamoDAO {
  
  protected dynamoClient = new DynamoDBClient({ region: "us-west-2" });

  protected userTableName = "User";
  protected followTableName = "follows";
  protected followIndexName = "follows-index";

  async getUser(alias: string): Promise<UserDto | null> {
    const getItemParams = {
      TableName: this.userTableName,
      Key: {
        alias: { S: alias },
      },
    };

    try {
      const result = await this.dynamoClient.send(
        new GetItemCommand(getItemParams)
      );
      if (!result.Item) {
        return null;
      }

      // Map DynamoDB result to UserDto
      return {
        alias: result.Item.alias.S!,
        firstName: result.Item.firstName.S!,
        lastName: result.Item.lastName.S!,
        imageUrl: result.Item.imageUrl?.S || "",
      };
    } catch (error) {
      console.error(`Error fetching user with alias ${alias}:`, error);
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

  async populateFeed(
    followerAlias: string,
    statuses: StatusDto[]
  ): Promise<void> {
    try {
      const writeRequests = statuses.map((status) => ({
        PutRequest: {
          Item: {
            alias: { S: followerAlias }, // Follower's feed
            timestamp: { N: status.timestamp.toString() },
            post: { S: status.post },
            authorAlias: { S: status.user.alias }, // The user who made the post
          },
        },
      }));

      const batchWriteParams = {
        RequestItems: {
          Feed: writeRequests,
        },
      };

      await this.dynamoClient.send(new BatchWriteItemCommand(batchWriteParams));
      console.log(
        `Feed updated for ${followerAlias} with ${statuses.length} statuses.`
      );
    } catch (error) {
      console.error(`Error populating feed for ${followerAlias}:`, error);
      throw error;
    }
  }
}