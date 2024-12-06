import { DynamoDAOFactory } from "../../model/factories/DynamoDAOFactory";

export const handler = async (event: any) => {
    const daoFactory = new DynamoDAOFactory();

    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];

      const obj = JSON.parse(body);

      const status = JSON.parse(obj.status);

      await daoFactory.getStatusDao().populateFeed(obj.users, status);
    }
}