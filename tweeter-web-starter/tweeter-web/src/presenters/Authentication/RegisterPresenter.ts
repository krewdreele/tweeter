import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class RegisterPresenter extends AuthenticationPresenter {
  protected serviceOperation(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
    originalUrl?: string
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName!,
      lastName!,
      alias,
      password,
      imageBytes!,
      imageFileExtension!
    );
  }

  protected getItemDescription(): string {
    return "register";
  }

  protected navigate(originalUrl?: string): void {
    this.view.navigate("/");
  }
}
