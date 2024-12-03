import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }
    return this.DaoFactory.getFollowDao().loadMoreFollowers(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }
    return this.DaoFactory.getFollowDao().loadMoreFollowees(
      userAlias,
      pageSize,
      lastItem
    );
  }


  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if(!user){
      throw new Error("Unauthenticated");
    }

    return this.DaoFactory.getFollowDao().getUser(alias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    return this.DaoFactory.getFollowDao().getIsFollowerStatus(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    return this.DaoFactory.getFollowDao().getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }
    return this.DaoFactory.getFollowDao().getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    await this.DaoFactory.getFollowDao().follow(user, userAlias);

    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    await this.DaoFactory.getFollowDao().unfollow(user, userAlias);

    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }
}
