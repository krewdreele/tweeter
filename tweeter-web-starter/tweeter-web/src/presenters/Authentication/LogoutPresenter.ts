import { AuthToken } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";
import { MessageView, Presenter } from "../Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _service: AuthenticateService;

  public constructor(view: LogoutView) {
    super(view);
    this._service = new AuthenticateService();
  }

  public get service() {
    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.service.logOut(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "logout");
  }
}
