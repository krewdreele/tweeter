import { UserDto } from "tweeter-shared";

export interface FollowDAO {
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
    followerAlias: string,
    followeeAlias: string
  ): Promise<void>;

  unfollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void>;
}