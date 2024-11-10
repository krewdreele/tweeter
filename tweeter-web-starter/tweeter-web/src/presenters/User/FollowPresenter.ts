import { UserAliasRequest } from "tweeter-shared";
import { FollowStatusPresenter } from "./FollowStatusPresenter";
import { UserService } from "../../model/service/UserService";
import { UserInfoView } from "./UserInfoPresenter";

export class FollowPresenter extends FollowStatusPresenter {
  public constructor(view: UserInfoView) {
    super(view);
  }
  
  protected followOperation(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.service.follow(request);
  }
  protected getDescription(): string {
    return "Following ";
  }
  protected setFollower(): boolean {
    return true;
  }
}

