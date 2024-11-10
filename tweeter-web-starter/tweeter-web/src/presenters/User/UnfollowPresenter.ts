import { UserAliasRequest } from "tweeter-shared";
import { UserInfoPresenter, UserInfoView } from "./UserInfoPresenter";
import { FollowStatusPresenter } from "./FollowStatusPresenter";

export class UnfollowPresenter extends FollowStatusPresenter {
  public constructor(view: UserInfoView) {
    super(view);
  }
  protected followOperation(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.service.unfollow(request);
  }
  protected getDescription(): string {
    return "Unfollowing ";
  }
  protected setFollower(): boolean {
    return false;
  }
}
