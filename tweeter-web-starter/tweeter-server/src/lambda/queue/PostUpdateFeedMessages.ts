import { DynamoDAOFactory } from "../../model/factories/DynamoDAOFactory";

const feedQueueUrl =
  "https://sqs.us-west-2.amazonaws.com/148761636150/TweeterUpdateFeed";

export const handler = async (event: any) => {
    const daoFactory = new DynamoDAOFactory();

    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];

      const obj = JSON.parse(body);

      let notDone = true;

      if (!obj || !obj.author) {
        console.error("Invalid body or author:", obj);
        continue;
      }
    let nextToken = null;

    while (notDone) {
      try {
        const { aliases, hasMore } = await daoFactory
          .getFollowDao()
          .loadFollowersAliases(obj.author, 25, nextToken);

        if (!Array.isArray(aliases)) {
          console.error("Invalid aliases:", aliases);
          break;
        }

        notDone = hasMore;
        nextToken = hasMore ? aliases[aliases.length - 1] : null;

        const message = {
          status: body,
          users: aliases,
        };

        await daoFactory.getFeedQueueDao().sendToQueue(feedQueueUrl, message);
      } catch (err) {
        console.error("Error in loading followers:", err);
        break;
      }
    }
      
    }
}

