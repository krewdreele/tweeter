import { AuthenticateDAO } from "../daos/AuthenticateDAO";
import { ImageDAO } from "../daos/ImageDAO";
import { StatusDAO } from "../daos/StatusDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { QueueDAO } from "../daos/QueueDAO";
import { FeedQueueDto, StatusQueueDto } from "tweeter-shared";

export interface DAOFactory {
    getAuthDao: () => AuthenticateDAO
    getFollowDao: () => FollowDAO
    getStatusDao: () => StatusDAO
    getImageDao: () => ImageDAO
    getStatusQueueDao: () => QueueDAO<StatusQueueDto>
    getFeedQueueDao: () => QueueDAO<FeedQueueDto>
}