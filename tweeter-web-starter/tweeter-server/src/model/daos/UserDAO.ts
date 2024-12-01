import { UserDto } from "tweeter-shared";

export interface UserDAO {
  loadMoreFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getUser(alias: string): Promise<UserDto | null>;

  getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean>;

  getFolloweeCount(userAlias: string): Promise<number>;

  getFollowerCount(userAlias: string): Promise<number>;

  follow(
    userAlias: string
  ): Promise<void>;

  unfollow(
    userAlias: string
  ): Promise<void>;
}