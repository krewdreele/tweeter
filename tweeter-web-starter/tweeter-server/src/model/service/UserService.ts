import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class UserService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): [UserDto[], boolean] {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);

    return user ? user.dto : null;
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }
}
