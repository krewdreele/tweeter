import { User, PagedItemRequest, UserAliasRequest, IsFollowerRequest, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private server = new ServerFacade();

  public async loadMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return await this.server.getMoreUserItems(request, "follower");
  }

  public async loadMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return await this.server.getMoreUserItems(request, "followee");
  }

  public async getUser(request: UserAliasRequest): Promise<User | null> {
    return await this.server.getUser(request);
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    return await this.server.getIsFollower(request);
  }

  public async getFolloweeCount(request: UserAliasRequest): Promise<number> {
    return this.server.getCount(request, "followee");
  }

  public async getFollowerCount(request: UserAliasRequest): Promise<number> {
    return this.server.getCount(request, "follower");
  }

  public async follow(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const [followerCount, followeeCount] = await this.server.follow(request);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const [followerCount, followeeCount] = await this.server.unfollow(request);

    return [followerCount, followeeCount];
  }
}
