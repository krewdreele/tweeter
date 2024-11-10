import { AuthToken, User, UserAliasRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { MessageView, Presenter } from "../Presenter";
import { UserInfoView } from "./UserInfoPresenter";

export abstract class FollowStatusPresenter extends Presenter<UserInfoView> {
  protected service: UserService;

  protected constructor(view: UserInfoView){
    super(view);
    this.service = new UserService();
  }

  public async changeFollowStatus(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(
          `${this.getDescription()} ${displayedUser!.name}...`,
          0
        );
        const [followerCount, followeeCount] = await this.followOperation({
          token: authToken.token,
          userAlias: displayedUser.alias,
        });

        this.view.setIsFollower(this.setFollower());
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      this.getDescription(),
      () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }

  protected abstract followOperation(
    request: UserAliasRequest
  ): Promise<[followerCount: number, followeeCount: number]>;
  protected abstract getDescription(): string;
  protected abstract setFollower(): boolean;
}
