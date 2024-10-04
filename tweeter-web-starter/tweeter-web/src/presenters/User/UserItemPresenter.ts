import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
    addItems: (newItems: User[]) => void;
    displayErrorMessage: (error: string) => void;
}

export abstract class UserItemPresenter {
    private _hasMoreItems = true;
    private _lastItem: User | null = null;

    private _view: UserItemView;

    protected constructor(view: UserItemView){
        this._view = view;
    }

    protected get view(){
        return this._view;
    }

    public get hasMoreItems(){
        return this._hasMoreItems;
    }

    protected get lastItem(){
        return this._lastItem;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    protected set lastItem(item: User | null){
        this._lastItem = item;
    }


    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}