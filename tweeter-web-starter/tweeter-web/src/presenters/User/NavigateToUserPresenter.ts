import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface NavigateToUserView extends View {
  extractAlias: (user: string) => string;
  setDisplayedUser: (user: User) => void;
}

export class NavigateToUserPresenter extends Presenter<NavigateToUserView> {
  private service: UserService;

  public constructor(view: NavigateToUserView) {
    super(view);
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User
  ) {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      let alias = this.view.extractAlias(event.target.toString());
      alias = alias.replace('@', '');
      const user = await this.service.getUser({token: authToken.token, userAlias: alias});

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }
}
