import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { ItemPresenter, ItemView } from "../ItemPresenter";
import { UserService } from "../../model/service/UserService";

export abstract class UserItemPresenter extends ItemPresenter<
  User,
  UserService
> {
  protected createService(): UserService {
    return new UserService();
  }
}
