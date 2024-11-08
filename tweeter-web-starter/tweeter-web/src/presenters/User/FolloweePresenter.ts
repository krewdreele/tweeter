import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "../User/UserItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowees(
      {
      token: authToken!.token,
      userAlias: userAlias,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem ? this.lastItem.dto : null
    }
    );
  }

  protected getItemDescription(): string {
    return "load followees";
  }
}
