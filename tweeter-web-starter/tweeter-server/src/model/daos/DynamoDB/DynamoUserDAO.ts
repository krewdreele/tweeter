import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";

export class DynamoUserDAO implements UserDAO {
    loadMoreFollowers(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
        throw new Error("Method not implemented.");
    }
    loadMoreFollowees(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
        throw new Error("Method not implemented.");
    }
    getUser(alias: string): Promise<UserDto | null> {
        throw new Error("Method not implemented.");
    }
    getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getFolloweeCount(userAlias: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getFollowerCount(userAlias: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    follow(userAlias: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    unfollow(userAlias: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}