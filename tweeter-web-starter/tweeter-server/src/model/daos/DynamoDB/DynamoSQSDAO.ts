import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { QueueDAO } from "../QueueDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoSQSDAO<T> extends DynamoDAO implements QueueDAO<T> {
  private sqsClient = new SQSClient();

  public async sendToQueue(url: string, body: T) {
    const messageBody = JSON.stringify(body);

    const params = {
      MessageBody: messageBody,
      QueueUrl: url,
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
