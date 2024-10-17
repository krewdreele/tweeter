import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export interface AuthenticationView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (path: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  protected service: AuthenticateService;

  public constructor(view: AuthenticationView) {
    super(view);
    this.service = new AuthenticateService();
  }

  public async authenticate(
    alias: string,
    password: string,
    rememberMe: boolean,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
    originalUrl?: string
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.serviceOperation(
          alias,
          password,
          firstName,
          lastName,
          imageBytes,
          imageFileExtension
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        this.navigate(originalUrl);
      },
      this.getItemDescription(),
      () => this.view.setIsLoading(false)
    );
  }

  protected abstract serviceOperation(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]>;

  protected abstract navigate(originalUrl?: string): void;

  protected abstract getItemDescription(): string;
}
