import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "../User/UserItemPresenter";
import { ItemView, PAGE_SIZE } from "../ItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected getItemDescription(): string {
    return "load followers";
  }
  protected async getMoreItems(authToken: AuthToken, userAlias: string) {
    return await this.service.loadMoreFollowers(
      {
      token: authToken!.token,
      userAlias: userAlias,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem ? this.lastItem.dto : null
    });
  }
}
