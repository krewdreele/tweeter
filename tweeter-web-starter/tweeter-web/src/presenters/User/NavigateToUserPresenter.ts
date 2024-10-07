import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface NavigateToUserView {
  extractAlias: (user: string) => string;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class NavigateToUserPresenter {
  private service: UserService;
  private view: NavigateToUserView;

  public constructor(view: NavigateToUserView) {
    this.view = view;
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User
  ) {
    event.preventDefault();

    try {
      const alias = this.view.extractAlias(event.target.toString());

      const user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
