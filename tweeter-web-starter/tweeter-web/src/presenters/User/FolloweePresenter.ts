import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserItemPresenter, UserItemView } from "../User/UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private userService: UserService;

  public constructor(view: UserItemView) {
    super(view);
    this.userService = new UserService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.userService.loadMoreFollowees(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followees because of exception: ${error}`
      );
    }
  }
}
