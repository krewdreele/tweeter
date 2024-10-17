import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface ItemView<T> extends View {
  addItems(newItems: T[]): void;
}

export const PAGE_SIZE = 10;

export abstract class ItemPresenter<T, U> extends Presenter<ItemView<T>> {
  private _service: U;
  private _hasMoreItems = true;
  private _lastItem: T | null = null;

  public constructor(view: ItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  protected get service(): U {
    return this._service;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected set lastItem(item: T | null) {
    this._lastItem = item;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(
        authToken!,
        userAlias
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getItemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;
}
