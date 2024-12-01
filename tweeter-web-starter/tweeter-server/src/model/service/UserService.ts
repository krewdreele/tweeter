import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    
    return this.DaoFactory.getUserDao().loadMoreFollowers(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.DaoFactory.getUserDao().loadMoreFollowees(
      userAlias,
      pageSize,
      lastItem
    );
  }


  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    return this.DaoFactory.getUserDao().getUser(alias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    return this.DaoFactory.getUserDao().getIsFollowerStatus(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    return this.DaoFactory.getUserDao().getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    return this.DaoFactory.getUserDao().getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    
    await this.DaoFactory.getUserDao().follow(userAlias);

    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    
    await this.DaoFactory.getUserDao().unfollow(userAlias);

    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }
}
