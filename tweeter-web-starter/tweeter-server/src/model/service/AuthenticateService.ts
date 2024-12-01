import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class AuthenticateService extends Service {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    
    const response = await this.DaoFactory.getAuthDao().getUser(alias, password);

    if (response === null) {
      throw new Error("Invalid alias or password");
    }

    return response;
  }

  public async logOut(token: string): Promise<void> {
    await this.DaoFactory.getAuthDao().logOut(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {

    const userDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageFileExtension
    }

    const response = await this.DaoFactory.getAuthDao().register(userDto, password);

    if (response === null) {
      throw new Error("Invalid registration");
    }

    return response;
  }
}
