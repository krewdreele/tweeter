import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import {
    DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  Select,
} from "@aws-sdk/client-dynamodb";

export class DynamoUserDAO implements UserDAO {
  private followTableName = "follows";
  private followIndexName = "follows-index";
  private dynamoClient = new DynamoDBClient({ region: "us-west-2" });
  private userTableName = "User";
  private followers: UserDto[] = [];
  private followees: UserDto[] = [];

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

  async getUserAlias(token: string) {
    // Retrieve the authenticated user using the authToken
    const getUserParams = {
      TableName: this.userTableName,
      IndexName: "authToken-index", // Use a GSI for querying by token
      KeyConditionExpression: "authToken = :token",
      ExpressionAttributeValues: {
        ":token": { S: token },
      },
      ProjectionExpression: "alias", // Only fetch the alias field
    };
    const userResult = await this.dynamoClient.send(
      new QueryCommand(getUserParams)
    );
    if (!userResult.Items || userResult.Items.length === 0) {
      throw new Error("Invalid or expired auth token");
    }

    const followerAlias = userResult.Items[0].alias.S; // Extract the alias of the authenticated user

    return followerAlias;
  }
  async follow(token: string, userAlias: string): Promise<void> {
    const followerAlias = await this.getUserAlias(token);
    // Add the follow relationship to the follows table
    const putItemParams = {
      TableName: this.followTableName,
      Item: {
        follower_handle: { S: followerAlias! },
        followee_handle: { S: userAlias },
      },
    };

    await this.dynamoClient.send(new PutItemCommand(putItemParams));
  }

  async unfollow(token: string, userAlias: string): Promise<void> {
    const followeeAlias = await this.getUserAlias(token);

    const deleteItemParams = {
      TableName: this.followTableName,
      Key: {
        follower_handle: { S: userAlias },
        followee_handle: { S: followeeAlias! },
      },
    };

    try {
      await this.dynamoClient.send(new DeleteItemCommand(deleteItemParams));
      console.log(`${userAlias} has unfollowed ${followeeAlias}`);
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
    return this.loadMore(userAlias, pageSize, lastItem, "followers");
  }

  async loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMore(userAlias, pageSize, lastItem, "followees");
  }

  async loadMore(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    type: string
  ): Promise<[UserDto[], boolean]> {
    try {
      let aliases: string[] = [];
      let dtos: (UserDto | null)[] = [];
      let nonNullDtos: UserDto[] = [];

      if (type === "followers" ? !this.followers : !this.followees) {
        // Get list of followee aliases from the follow table
        aliases = await this.getUserItems(
          userAlias,
          type === "followers" ? "followee_handle" : "follower_handle"
        );

        // Fetch full UserDto for each alias
        dtos = await Promise.all(aliases.map((alias) => this.getUser(alias)));

        // Filter null results and paginate
        nonNullDtos = dtos.filter((user) => user !== null) as UserDto[];

        // Cache results
        if (type === "followers") {
          this.followers = nonNullDtos;
        } else {
          this.followees = nonNullDtos;
        }
      } else {
        nonNullDtos = type === "follower" ? this.followers : this.followees;
      }

      return this.paginate(lastItem, nonNullDtos, pageSize);
    } catch (error) {
      console.error("Error loading followees:", error);
      throw error;
    }
  }

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

  paginate = (
    lastItem: UserDto | null,
    items: UserDto[],
    pageSize: number
  ): [UserDto[], boolean] => {
    let startIndex = 0;
    if (lastItem) {
      startIndex = items.findIndex((item) => item.alias === lastItem.alias) + 1;
    }

    const paginatedItems = items.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < items.length;

    return [paginatedItems, hasMore];
  };

  async getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const queryParams = {
      TableName: this.followTableName,
      KeyConditionExpression:
        "follower_handle = :follower AND followee_handle = :followee",
      ExpressionAttributeValues: {
        ":follower": { S: selectedUserAlias },
        ":followee": { S: userAlias },
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
