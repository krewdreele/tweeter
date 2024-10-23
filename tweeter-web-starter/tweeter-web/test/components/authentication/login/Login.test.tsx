import { render, screen } from "@testing-library/react";
import Login from "../../../../src/components/authentication/login/Login";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/Authentication/LoginPresenter";
import { anything, instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = getElementsFromRender();
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      getElementsFromRender();

    await user.type(aliasField, "f");
    await user.type(passwordField, "g");

    expect(signInButton).toBeEnabled();
  });

  it("disables sign in button if either field is blank", async () => {
    const { signInButton, aliasField, passwordField, user } =
      getElementsFromRender();

    await user.type(aliasField, "f");
    await user.type(passwordField, "f");

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "f");
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct params when sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const presenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "@SomeUser";
    const password = "password";
    const { signInButton, aliasField, passwordField, user } =
      getElementsFromRender(originalUrl, presenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(
      mockPresenter.authenticate(alias, password, anything(), originalUrl)
    ).once();
  });
});

const renderLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter}></Login>
      ) : (
        <Login originalUrl={originalUrl}></Login>
      )}
    </MemoryRouter>
  );
};

const getElementsFromRender = (
  originalUrl?: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
