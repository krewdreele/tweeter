import { AuthenticateDAO } from "../daos/AuthenticateDAO";
import { ImageDAO } from "../daos/ImageDAO";
import { StatusDAO } from "../daos/StatusDAO";
import { FollowDAO } from "../daos/FollowDAO";

export interface DAOFactory {
    getAuthDao: () => AuthenticateDAO
    getFollowDao: () => FollowDAO
    getStatusDao: () => StatusDAO
    getImageDao: () => ImageDAO
}