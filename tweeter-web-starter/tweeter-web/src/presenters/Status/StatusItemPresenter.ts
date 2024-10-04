import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusItemView {
  displayErrorMessage(error: string): void;
  addItems(newItems: Status[]): void;
}

export abstract class StatusItemPresenter {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  private _view: StatusItemView;

  protected constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
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

  protected set lastItem(item: Status | null) {
    this._lastItem = item;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
