import { StatusDto, UserDto } from "tweeter-shared";
import { DAOFactory } from "../factories/DAOFactory";
import { DynamoDAOFactory } from "../factories/DynamoDAOFactory";

export enum DatabaseType {
    Dynamo,
    SQL
}

export abstract class Service {
  protected DaoFactory: DAOFactory;

  public constructor(type?: DatabaseType) {
    if (type !== undefined) {
      switch (type) {
        case DatabaseType.Dynamo:
          this.DaoFactory = new DynamoDAOFactory();
          break;
        default:
          this.DaoFactory = new DynamoDAOFactory();
      }
    } else {
      this.DaoFactory = new DynamoDAOFactory();
    }
  }

  protected returnUsersWithAtSymbol(list: UserDto[]) {
    let newList: UserDto[] = [];

    for (let i = 0; i < list.length; i++) {
      newList.push({
        firstName: list[i].firstName,
        lastName: list[i].lastName,
        alias: "@" + list[i].alias,
        imageUrl: list[i].imageUrl,
      });
    }

    return newList;
  }

  protected returnStatusesWithAtSymbol(list: StatusDto[]) {
    let newList: StatusDto[] = [];

    for (let i = 0; i < list.length; i++) {
      newList.push({
        post: list[i].post,
        timestamp: list[i].timestamp,
        user: {
            firstName: list[i].user.firstName,
            lastName: list[i].user.lastName,
            alias: '@'+list[i].user.alias,
            imageUrl: list[i].user.imageUrl
        }
      });
    }

    return newList;
  }
}