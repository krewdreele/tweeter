import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "../User/UserItemPresenter";
import { ItemView, PAGE_SIZE } from "../ItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected getItemDescription(): string {
    return "load followers";
  }
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFollowers(
      authToken!,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}
