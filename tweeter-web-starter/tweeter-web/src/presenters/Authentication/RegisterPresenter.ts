import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends AuthenticationPresenter {
  protected async serviceOperation(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]> {
    return await this.service.register(
      {
        firstName: firstName!,
        lastName: lastName!,
        alias: alias,
        password: password,
        userImageBase64: Buffer.from(imageBytes!).toString("base64"),
        imageFileExtension: imageFileExtension!,
        token: ""
      }
    );
  }

  protected getItemDescription(): string {
    return "register";
  }

  protected navigate(): void {
    this.view.navigate("/");
  }
}
