import { AuthToken } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";
import { MessageView, Presenter } from "../Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private service: AuthenticateService;

  public constructor(view: LogoutView) {
    super(view);
    this.service = new AuthenticateService();
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "logout");
  }
}
