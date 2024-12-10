import bcrypt from "bcryptjs";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthenticateDAO } from "../AuthenticateDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoAuthDAO extends DynamoDAO implements AuthenticateDAO {
  async register(
    user: UserDto,
    password: string
  ): Promise<[UserDto, AuthTokenDto] | null> {
    const { alias, firstName, lastName, imageUrl } = user;
    const authToken = this.generateAuthToken();
    const timestamp = new Date().toISOString();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user data
    const userParams = {
      TableName: this.userTableName,
      Item: {
        alias: { S: alias },
        firstName: { S: firstName },
        lastName: { S: lastName },
        imageUrl: { S: imageUrl },
        password: { S: hashedPassword }, // Store the hashed password
        authToken: { S: authToken },
        sessionTimestamp: { S: timestamp },
        followerCount: {N: "0"},
        followeeCount: {N: "0"}
      },
    };

    try {
      await this.dynamoClient.send(new PutItemCommand(userParams));
      return [
        user,
        { token: authToken, timestamp: Number(new Date(timestamp).getTime()) },
      ];
    } catch (error) {
      console.error("Error registering user:", error);
      return null;
    }
  }

  async login(
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
      // Step 1: Fetch user data
      const userResult = await this.dynamoClient.send(
        new GetItemCommand(userParams)
      );
      if (!userResult.Item || !userResult.Item.password.S) {
        throw new Error("User not found");
      }

      const storedHashedPassword = userResult.Item.password.S;

      // Step 2: Validate password
      const isPasswordValid = await bcrypt.compare(
        password,
        storedHashedPassword
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      // Step 3: Map user data to UserDto
      const user: UserDto = {
        alias,
        firstName: userResult.Item.firstName.S ?? "unknown",
        lastName: userResult.Item.lastName.S ?? "unknown",
        imageUrl: userResult.Item.imageUrl?.S ?? "unknown",
      };

      // Step 4: Generate new authToken and sessionTimestamp
      const authToken = this.generateAuthToken();
      const sessionTimestamp = new Date().toISOString();

      // Step 5: Update authToken and sessionTimestamp in the database
      const updateParams = {
        TableName: this.userTableName,
        Key: {
          alias: { S: alias },
        },
        UpdateExpression:
          "SET authToken = :authToken, sessionTimestamp = :sessionTimestamp",
        ExpressionAttributeValues: {
          ":authToken": { S: authToken },
          ":sessionTimestamp": { S: sessionTimestamp },
        },
      };

      await this.dynamoClient.send(new UpdateItemCommand(updateParams));

      // Convert back to number
      const timestamp = new Date(sessionTimestamp).getTime();

      // Step 6: Return user and token data
      return [user, { token: authToken, timestamp: timestamp }];
    } catch (error) {
      console.error("Error fetching or updating user:", error);
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

  async authenticate(token: string) {
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

    return followerAlias!;
  }
}
