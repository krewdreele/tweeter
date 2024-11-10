import { AuthToken, User, FakeData, TweeterRequest, PagedUserItemRequest, UserAliasRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private server = new ServerFacade();

  public async loadMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    console.log("called");
    return await this.server.getMoreUserItems(request, "follower");
  }

  public async loadMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    console.log("called");
    return await this.server.getMoreUserItems(request, "followee");
  }

  public async getUser(
    request: UserAliasRequest
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return await this.server.getUser(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }
}
