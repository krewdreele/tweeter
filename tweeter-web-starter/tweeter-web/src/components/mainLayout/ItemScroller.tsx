import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { ItemPresenter, ItemView } from "../../presenters/ItemPresenter";

interface Props<T, U> {
  presenterGenerator: (view: ItemView<T>) => ItemPresenter<T, U>;
  itemComponentGenerator: (item: T) => JSX.Element;
}

const ItemScroller = <T, U>(props: Props<T, U>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(false);

  const { displayedUser, authToken } = useUserInfo();

  const listener: ItemView<T> = {
    addItems: (newItems) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const loadMoreItems = async () => {
    await presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
