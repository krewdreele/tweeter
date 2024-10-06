import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../../model/service/LoginService";

export interface LoginView {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (error: string) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter {
  private loginService: LoginService;
  private _view: LoginView;

  public constructor(view: LoginView) {
    this._view = view;
    this.loginService = new LoginService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string | undefined
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.loginService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }
}
