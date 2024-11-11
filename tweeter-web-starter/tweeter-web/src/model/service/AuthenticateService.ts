import { User, AuthToken, LoginRequest, TweeterRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class AuthenticateService {
  private server = new ServerFacade();

  public async login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    
    const [user, token] = await this.server.login(request);

    return [user, token];
  }

  public async logOut(request: TweeterRequest): Promise<void> {
    await this.server.logOut(request);
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const [user, token] = await this.server.register(request);

    return [user, token];
  }
}
