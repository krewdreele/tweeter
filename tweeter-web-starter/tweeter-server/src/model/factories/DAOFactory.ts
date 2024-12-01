import { AuthenticateDAO } from "../daos/AuthenticateDAO";
import { ImageDAO } from "../daos/ImageDAO";
import { StatusDAO } from "../daos/StatusDAO";
import { UserDAO } from "../daos/UserDAO";

export interface DAOFactory {
    getAuthDao: () => AuthenticateDAO
    getUserDao: () => UserDAO
    getStatusDao: () => StatusDAO
    getImageDao: () => ImageDAO
}