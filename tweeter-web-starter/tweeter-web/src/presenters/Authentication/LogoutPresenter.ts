import { AuthToken } from "tweeter-shared";
import { LogoutService } from "../../model/service/LogoutService";

export interface LogoutView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter {
  private logoutService: LogoutService;
  private _view: LogoutView;

  public constructor(view: LogoutView) {
    this._view = view;
    this.logoutService = new LogoutService();
  }

  public async logOut(authToken: AuthToken) {
    this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logoutService.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
