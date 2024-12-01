import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthenticateDAO } from "../AuthenticateDAO";

export class DynamoAuthDAO implements AuthenticateDAO {
  private userTableName = "User";
  private dynamoClient = new DynamoDBClient({ region: "us-west-2" }); 

  async register(
    user: UserDto,
    password: string
  ): Promise<[UserDto, AuthTokenDto] | null> {
    const { alias, firstName, lastName, imageUrl } = user;
    const authToken = this.generateAuthToken();
    const timestamp = new Date().toISOString(); // Record creation time

    // Store user data
    const userParams = {
      TableName: this.userTableName,
      Item: {
        alias: { S: alias },
        firstName: { S: firstName },
        lastName: { S: lastName },
        imageUrl: { S: imageUrl },
        password: { S: password }, // Hash before storing
        authToken: {
          M: {
            token: { S: authToken },
            timestamp: { S: timestamp },
          },
        },
      },
    };

    try {
      await this.dynamoClient.send(new PutItemCommand(userParams));

      return [user, { token: authToken, timestamp: Number(timestamp) }];
    } catch (error) {
      console.error("Error registering user:", error);
      return null;
    }
  }

  async getUser(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userParams = {
      TableName: this.userTableName,
      Key: {
        alias: { S: alias },
      },
    };

    try {
      // Fetch user data
      const userResult = await this.dynamoClient.send(
        new GetItemCommand(userParams)
      );
      if (!userResult.Item) {
        throw new Error("User not found");
      }

      // Validate password
      if (userResult.Item.password.S !== password) {
        throw new Error("Invalid password");
      }

      const user: UserDto = {
        alias,
        firstName: userResult.Item.firstName.S ?? "unknown",
        lastName: userResult.Item.lastName.S ?? "unknown",
        imageUrl: userResult.Item.imageUrl.S ?? "unknown",
      };

      // Generate a new token
      const authToken = this.generateAuthToken();
      const timestamp = new Date().toISOString();

      const updateParams = {
        TableName: this.userTableName,
        Key: {
          alias: { S: alias },
        },
        UpdateExpression: "SET authToken = :authToken",
        ExpressionAttributeValues: {
          ":authToken": {
            M: {
              token: { S: authToken },
              timestamp: { S: timestamp },
            },
          },
        },
      };

      await this.dynamoClient.send(new UpdateItemCommand(updateParams));

      return [user, { token: authToken, timestamp: Number(timestamp) }];
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async logOut(alias: string): Promise<void> {
    const updateParams = {
      TableName: this.userTableName,
      Key: {
        alias: { S: alias },
      },
      UpdateExpression: "REMOVE authToken",
    };

    try {
      // Remove the authToken field
      await this.dynamoClient.send(new UpdateItemCommand(updateParams));
      console.log(`User ${alias} logged out successfully.`);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  generateAuthToken(): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const tokenLength = 32;
    let token = "";

    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }

    return token;
  }
}
