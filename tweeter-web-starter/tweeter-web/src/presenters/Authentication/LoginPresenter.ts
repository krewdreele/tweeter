import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  protected serviceOperation(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }

  protected getItemDescription(): string {
    return "login";
  }

  protected navigate(originalUrl?: string): void {
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
  }
}
