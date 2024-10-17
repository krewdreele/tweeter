import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/User/FolloweePresenter";
import { FollowerPresenter } from "./presenters/User/FollowerPresenter";
import { FeedPresenter } from "./presenters/Status/FeedPresenter";
import { StoryPresenter } from "./presenters/Status/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={"feed"}
              presenterGenerator={(view) => new FeedPresenter(view)}
              itemComponentGenerator={(item: Status) => {
                return <StatusItem status={item}></StatusItem>;
              }}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={"story"}
              presenterGenerator={(view) => new StoryPresenter(view)}
              itemComponentGenerator={(item: Status) => {
                return <StatusItem status={item}></StatusItem>;
              }}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={"followees"}
              presenterGenerator={(view) => new FolloweePresenter(view)}
              itemComponentGenerator={(item: User) => {
                return <UserItem value={item}></UserItem>;
              }}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={"followers"}
              presenterGenerator={(view) => new FollowerPresenter(view)}
              itemComponentGenerator={(item: User) => {
                return <UserItem value={item}></UserItem>;
              }}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
