import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface GetUserView {
  extractAlias: (user: string) => string;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class GetUserPresenter {
  private userService: UserService;
  private _view: GetUserView;

  public constructor(view: GetUserView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User
  ) {
    event.preventDefault();

    try {
      const alias = this._view.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayedUser(currentUser!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
