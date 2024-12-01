import { DynamoAuthDAO } from "../daos/DynamoDB/DynamoAuthDAO";
import { S3DAO } from "../daos/DynamoDB/S3DAO";
import { DynamoStatusDAO } from "../daos/DynamoDB/DynamoStatusDAO";
import { DynamoUserDAO } from "../daos/DynamoDB/DynamoUserDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
    getAuthDao = () => new DynamoAuthDAO();
    getUserDao = () => new DynamoUserDAO();
    getStatusDao = () => new DynamoStatusDAO();
    getImageDao = () => new S3DAO();
}