import { DAOFactory } from "../factories/DAOFactory";
import { DynamoDAOFactory } from "../factories/DynamoDAOFactory";

export enum DatabaseType {
    Dynamo,
    SQL
}

export abstract class Service {

    protected DaoFactory: DAOFactory;

    public constructor(type?: DatabaseType){
        if(type !== undefined){
            switch (type) {
              case DatabaseType.Dynamo:
                this.DaoFactory = new DynamoDAOFactory();
                break;
              default:
                this.DaoFactory = new DynamoDAOFactory();
            }
        }
        else {
            this.DaoFactory = new DynamoDAOFactory();
        }
    }
}