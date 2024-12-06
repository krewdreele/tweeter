import { StatusDto, UserDto } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";
import {
  BatchWriteItemCommand,
    DeleteItemCommand,
  PutItemCommand,
  QueryCommand,
  Select,
} from "@aws-sdk/client-dynamodb";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowDAO extends DynamoDAO implements FollowDAO {
  protected followTableName = "follows";
  protected followIndexName = "follows-index";

  async getFolloweeCount(userAlias: string): Promise<number> {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression: "follower_handle = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": { S: userAlias },
      },
      Select: Select.COUNT, // Only count items without returning the actual data
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      return result.Count || 0; // Return the count or 0 if no items
    } catch (error) {
      console.error(`Error retrieving followee count for ${userAlias}:`, error);
      throw error;
    }
  }

  async getFollowerCount(userAlias: string): Promise<number> {
    const queryParams = {
      TableName: this.followTableName,
      IndexName: this.followIndexName,
      KeyConditionExpression: "followee_handle = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": { S: userAlias },
      },
      Select: Select.COUNT, // Only count items without returning the actual data
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      return result.Count || 0; // Return the count or 0 if no items
    } catch (error) {
      console.error(`Error retrieving follower count for ${userAlias}:`, error);
      throw error;
    }
  }

  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    const putFollowParams = {
      TableName: this.followTableName,
      Item: {
        follower_handle: { S: followerAlias! },
        followee_handle: { S: followeeAlias },
      },
    };

    try {
      // Insert follow relationship
      await this.dynamoClient.send(new PutItemCommand(putFollowParams));

      console.log(`${followerAlias} is now following ${followeeAlias}.`);
    } catch (error) {
      console.error(`Error following user ${followeeAlias}:`, error);
      throw error;
    }
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const deleteItemParams = {
      TableName: this.followTableName,
      Key: {
        follower_handle: { S: followerAlias },
        followee_handle: { S: followeeAlias! },
      },
    };

    try {
      await this.dynamoClient.send(new DeleteItemCommand(deleteItemParams));
      console.log(`${followerAlias} has unfollowed ${followeeAlias}`);
    } catch (error) {
      console.error(`Error unfollowing user ${followeeAlias}:`, error);
      throw error;
    }
  }

  async loadMoreFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const { aliases, hasMore } = await this.loadFollowersAliases(
      userAlias,
      pageSize,
      lastItem?.alias ?? null
    );
    // Fetch full UserDto for each alias
    const dtos = await Promise.all(aliases.map((alias) => this.getUser(alias)));

    // Filter out null results
    const nonNullDtos = dtos.filter((user) => user !== null) as UserDto[];

    return [nonNullDtos, hasMore];
  }

  async loadFollowersAliases(
    userAlias: string,
    pageSize: number,
    lastItemAlias: string | null
  ) {
    const queryParams = {
      TableName: this.followTableName,
      IndexName: this.followIndexName, // Use an index for querying by followee_handle
      KeyConditionExpression: `followee_handle = :userAlias`,
      ExpressionAttributeValues: {
        ":userAlias": { S: userAlias },
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItemAlias
        ? {
            followee_handle: { S: userAlias },
            follower_handle: { S: lastItemAlias },
          }
        : undefined,
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      // Extract follower aliases (partition key is follower_handle)
      return {
        aliases: result.Items?.map((item) => item.follower_handle.S!) || [],
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`Error loading followers:`, error);
      throw error;
    }
  }

  async loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression: `follower_handle = :userAlias`,
      ExpressionAttributeValues: {
        ":userAlias": { S: userAlias },
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? {
            follower_handle: { S: userAlias },
            followee_handle: { S: lastItem.alias }, // Correct ExclusiveStartKey
          }
        : undefined,
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );

      // Extract followee aliases (sort key is followee_handle)
      const aliases =
        result.Items?.map((item) => item.followee_handle.S!) || [];

      // Fetch full UserDto for each alias
      const dtos = await Promise.all(
        aliases.map((alias) => this.getUser(alias))
      );

      // Filter out null results
      const nonNullDtos = dtos.filter((user) => user !== null) as UserDto[];

      const hasMore = !!result.LastEvaluatedKey;

      return [nonNullDtos, hasMore];
    } catch (error) {
      console.error(`Error loading followees:`, error);
      throw error;
    }
  }

  async getUserItems(handle: string, type: string): Promise<string[]> {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression: `${type} = :handle`,
      ExpressionAttributeValues: {
        ":handle": { S: handle },
      },
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      return (
        result.Items?.map((item) =>
          type === "followee_handle"
            ? item.follower_handle.S!
            : item.followee_handle.S!
        ) || []
      );
    } catch (error) {
      console.error(
        `Error retrieving ${
          type === "followee_handle" ? "followers" : "followees"
        }:`,
        error
      );
      throw error;
    }
  }

  async getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression:
        "follower_handle = :follower AND followee_handle = :followee",
      ExpressionAttributeValues: {
        ":follower": { S: userAlias },
        ":followee": { S: selectedUserAlias },
      },
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );
      return result.Count ? result.Count > 0 : false;
    } catch (error) {
      console.error(
        `Error checking if ${selectedUserAlias} is a follower of ${userAlias}:`,
        error
      );
      throw error;
    }
  }
}
