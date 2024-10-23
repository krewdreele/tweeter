import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../src/presenters/Status/PostStatusPresenter";
import { anything, instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

describe("Post Status Component", () => {
  it("has disabled buttons on first render", () => {
    const { postStatus, clearStatus } = getElementsFromRender();

    expect(postStatus).toBeDisabled();
    expect(clearStatus).toBeDisabled();
  });

  it("has both buttons enabled when text field has text", async () => {
    const { postStatus, clearStatus, textField, user } =
      getElementsFromRender();

    await user.type(textField, "h");

    expect(clearStatus).toBeEnabled();
    expect(postStatus).toBeEnabled();
  });

  it("has both buttons cleared when text field is cleared", async () => {
    const { postStatus, clearStatus, textField, user } =
      getElementsFromRender();

    await user.type(textField, "hello");
    await user.clear(textField);
    expect(postStatus).toBeDisabled();
    expect(clearStatus).toBeDisabled();
  });

  it("calls the presenter to post the status with the correct params", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const presenterInstance = instance(mockPresenter);

    const { postStatus, textField, user } =
      getElementsFromRender(presenterInstance);

    await user.type(textField, "hello");
    await user.click(postStatus);

    verify(mockPresenter.submitPost(anything(), "hello", anything())).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter}></PostStatus>
      ) : (
        <PostStatus></PostStatus>
      )}
    </MemoryRouter>
  );
};

const getElementsFromRender = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatus = screen.getByLabelText("postStatus");
  const clearStatus = screen.getByLabelText("clearStatus");
  const textField = screen.getByLabelText("textField");

  return { postStatus, clearStatus, textField, user };
};
