import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import {
  GetUserPresenter,
  GetUserView,
} from "../../presenters/User/GetUserPresenter";
import { useState } from "react";

interface NavigateToUserListener {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (user: string) => string;
}

const useNavigateToUserListener = (): NavigateToUserListener => {
  const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useUserInfo();

  const { displayErrorMessage } = useToastListener();
  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const listener: GetUserView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
    extractAlias: extractAlias,
  };

  const [presenter] = useState(new GetUserPresenter(listener));

  return {
    navigateToUser: (event) =>
      presenter.navigateToUser(event, authToken!, currentUser!),
    extractAlias: (user) => extractAlias(user),
  };
};

export default useNavigateToUserListener;
