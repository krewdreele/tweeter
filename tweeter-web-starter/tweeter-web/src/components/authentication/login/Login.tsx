import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationField from "../AuthenticationField";
import useUserInfo from "../../userInfo/UserInfoHook";
import {
  LoginView,
  LoginPresenter,
} from "../../../presenters/Authentication/LoginPresenter";

interface Props {
  presenterGenerator: (listener: LoginView) => LoginPresenter;
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      login();
    }
  };

  const listener: LoginView = {
    setIsLoading: setIsLoading,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const login = () => {
    presenter.doLogin(alias, password, rememberMe, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationField
        setAlias={setAlias}
        setPassword={setPassword}
        submit={loginOnEnter}
      ></AuthenticationField>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={login}
    />
  );
};

export default Login;
