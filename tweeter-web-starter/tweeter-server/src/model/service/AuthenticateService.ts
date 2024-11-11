import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class AuthenticateService {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the db
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async logOut(token: string): Promise<void> {
    return
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }
}
