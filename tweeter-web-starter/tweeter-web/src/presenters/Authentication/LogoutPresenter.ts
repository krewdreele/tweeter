import { AuthToken } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";

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
  private service: AuthenticateService;
  private _view: LogoutView;

  public constructor(view: LogoutView) {
    this._view = view;
    this.service = new AuthenticateService();
  }

  public async logOut(authToken: AuthToken) {
    this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
