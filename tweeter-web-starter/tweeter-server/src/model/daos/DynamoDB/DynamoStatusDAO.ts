import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import {
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStatusDAO extends DynamoDAO implements StatusDAO {

  async postStatus(newStatus: StatusDto): Promise<void> {
    const putItemParams = {
      TableName: "Status",
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

    const queryParams = {
      TableName: this.followTableName,
      IndexName: this.followIndexName, // Use an index for querying by followee_handle
      KeyConditionExpression: `followee_handle = :userAlias`,
      ExpressionAttributeValues: {
        ":userAlias": { S: newStatus.user.alias },
      }
    };

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand(queryParams)
      );

      // Extract follower aliases (partition key is follower_handle)
      const aliases =
        result.Items?.map((item) => item.follower_handle.S!) || [];

      for(let alias of aliases){
        this.populateFeed(alias, [newStatus]);
      }
    }
    catch(error){
      console.error(`Error getting followers for feed update: ${error}`)
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

 
}
