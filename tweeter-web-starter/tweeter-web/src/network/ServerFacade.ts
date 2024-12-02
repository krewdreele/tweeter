import {
  AuthenticateResponse,
  AuthToken,
  CountResponse,
  FollowResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserAliasRequest,
  UserDto,
  UserItemResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://8dmtk68jtf.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreUserItems(
    request: PagedItemRequest<UserDto>,
    type: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, `/${type}/list`);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${type} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async getUser(request: UserAliasRequest): Promise<User> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      UserItemResponse
    >(request, `/user`);

    const user = response.user ? User.fromDto(response.user) : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async getIsFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, `/user/isFollower`);

    // Handle errors
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async getCount(
    request: UserAliasRequest,
    type: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      CountResponse
    >(request, `/${type}/count`);

    // Handle errors
    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async follow(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      FollowResponse
    >(request, `/user/follow`);

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async unfollow(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      FollowResponse
    >(request, `/user/unfollow`);

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async getMoreStatusItems(
    request: PagedItemRequest<StatusDto>,
    type: string
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, `/${type}`);

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${type} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, `/story/post`);

    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async login(
    request: LoginRequest
  ): Promise<[user: User, authToken: AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/login");

    const user = response.user ? User.fromDto(response.user) : null;
    const token = response.authToken ? AuthToken.fromDto(response.authToken) : null;

    // Handle errors
    if (response.success) {
      if (user == null || token == null) {
        throw new Error(`Unable to login`);
      } else {
        return [user, token];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[user: User, authToken: AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/register");

    const user = response.user ? User.fromDto(response.user) : null;
    const token = response.authToken ? AuthToken.fromDto(response.authToken) : null;

    // Handle errors
    if (response.success) {
      if (user == null || token == null) {
        throw new Error(`Unable to register`);
      } else {
        return [user, token];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async logOut(request: TweeterRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse
    >(request, "/logout");

    if(response.success){
      return
    }
    else{
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }
}
