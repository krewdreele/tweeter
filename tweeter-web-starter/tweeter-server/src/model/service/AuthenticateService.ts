import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class AuthenticateService extends Service {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    
    const response = await this.DaoFactory.getAuthDao().login(alias, password);

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

    const url = await this.DaoFactory.getImageDao().putImage(alias, userImageBase64);

    const userDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: url
    }

    const response = await this.DaoFactory.getAuthDao().register(userDto, password);

    if (response === null) {
      throw new Error("Invalid registration");
    }

    return response;
  }
}
