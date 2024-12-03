import { DynamoAuthDAO } from "../daos/DynamoDB/DynamoAuthDAO";
import { S3DAO } from "../daos/DynamoDB/S3DAO";
import { DynamoStatusDAO } from "../daos/DynamoDB/DynamoStatusDAO";
import { DynamoFollowDAO } from "../daos/DynamoDB/DynamoFollowDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
    getAuthDao = () => new DynamoAuthDAO();
    getFollowDao = () => new DynamoFollowDAO();
    getStatusDao = () => new DynamoStatusDAO();
    getImageDao = () => new S3DAO();
}