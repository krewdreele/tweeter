import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

export class DynamoStatusDAO implements StatusDAO {
  private userTableName = "User";
  private followTableName = "follows";
  private dynamoClient = new DynamoDBClient({ region: "us-west-2" });

  async loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    let posts: StatusDto[] | null = null;

    try {
      posts = await this.getPosts(userAlias);
    } catch (error) {
      throw error;
    }

    return this.paginate(lastItem, posts, pageSize);
  }

  async postStatus(newStatus: StatusDto): Promise<void> {
    const updateParams = {
      TableName: this.userTableName,
      Key: {
        alias: { S: newStatus.user.alias },
      },
      UpdateExpression:
        "SET posts = list_append(if_not_exists(posts, :emptyList), :newPost)",
      ExpressionAttributeValues: {
        ":newPost": {
          L: [
            {
              M: {
                post: { S: newStatus.post },
                timestamp: { N: newStatus.timestamp.toString() },
                segments: {
                  L: newStatus.segments.map((segment) => ({
                    M: {
                      text: { S: segment.text },
                      startPosition: { N: segment.startPosition.toString() },
                      endPosition: { N: segment.endPosition.toString() },
                      type: { S: segment.type },
                    },
                  })),
                },
              },
            },
          ],
        },
        ":emptyList": { L: [] },
      },
    };

    try {
      await this.dynamoClient.send(new UpdateItemCommand(updateParams));
    } catch (error) {
      console.error("Error posting status:", error);
      throw error;
    }
  }

  async loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const followees = await this.getFollowees(userAlias);
    let posts: StatusDto[] = [];

    if (followees) {
      for (let followee of followees) {
        posts = [...posts, ...(await this.getPosts(followee))];
      }
    }

    return this.paginate(lastItem, posts, pageSize);
  }

  paginate = (
    lastItem: StatusDto | null,
    posts: StatusDto[],
    pageSize: number
  ) => {
    // Implement pagination
    let startIndex = 0;
    if (lastItem) {
      startIndex =
        posts.findIndex((p) => p.timestamp === lastItem.timestamp) + 1;
    }

    const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < posts.length;

    let response: [StatusDto[], boolean] = [paginatedPosts, hasMore];

    return response;
  };

  getPosts = async (userAlias: string) => {
    const getItemParams = {
      TableName: this.userTableName,
      Key: {
        alias: { S: userAlias },
      },
    };

    let posts = null;

    try {
      const result = await this.dynamoClient.send(
        new GetItemCommand(getItemParams)
      );

      if (!result.Item || !result.Item.posts) {
        return [];
      }

      posts = result.Item.posts.L!.map((post) => ({
        post: post.M!.post.S,
        user: {
          alias: result.Item!.alias.S,
          firstName: result.Item!.firstName.S,
          lastName: result.Item!.lastName.S,
          imageUrl: result.Item!.imageUrl.S,
        },
        timestamp: Number(post.M!.timestamp.N),
        segments: post.M!.segments.L!.map((segment) => ({
          text: segment.M!.text.S,
          startPosition: Number(segment.M!.startPosition.N),
          endPosition: Number(segment.M!.endPosition.N),
          type: segment.M!.type.S,
        })),
      })) as StatusDto[];
    } catch (error) {
      console.error("Error loading story items:", error);
      throw error;
    }
    return posts;
  };

  getFollowees = async (followerHandle: string): Promise<string[]> => {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression: "follower_handle = :follower_handle",
      ExpressionAttributeValues: {
        ":follower_handle": { S: followerHandle },
      },
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      return result.Items?.map((item) => item.followee_handle.S!) || [];
    } catch (error) {
      console.error("Error retrieving followees:", error);
      throw error;
    }
  };
}
