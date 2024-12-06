import { BatchWriteItemCommand, DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { StatusDto, UserDto } from "tweeter-shared";

export abstract class DynamoDAO {
  
  protected dynamoClient = new DynamoDBClient({ region: "us-west-2" });

  protected userTableName = "User";

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

}