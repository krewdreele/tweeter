import { AuthToken, User, UserAliasRequest } from "tweeter-shared";
import { MessageView, Presenter, View } from "../Presenter";
import { UserService } from "../../model/service/UserService";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFolloweeCount: (value: number) => void;
  setFollowerCount: (value: number) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  protected service: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new UserService();
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount({
          token: authToken.token,
          userAlias: displayedUser.alias,
        })
      );
    }, "get followees");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount({
          token: authToken.token,
          userAlias: displayedUser.alias,
        })
      );
    }, "get follower count");
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus({
            token: authToken!.token,
            userAlias: currentUser!.alias,
            selectedUserAlias: displayedUser!.alias,
          })
        );
      }
    }, "determine follower status");
  }

  
}