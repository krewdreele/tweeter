import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenters/Authentication/LogoutPresenter";

import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { AuthenticateService } from "../../src/model/service/AuthenticateService";

describe("AppNavBarPresenter", () => {
  let mockPresenter: LogoutPresenter;
  let mockView: LogoutView;
  let mockService: AuthenticateService;
  const authToken = new AuthToken("abc123", 0);

  beforeEach(() => {
    mockView = mock<LogoutView>();
    const viewInstance = instance(mockView);

    const presenterSpy = spy(new LogoutPresenter(viewInstance));
    mockPresenter = instance(presenterSpy);

    mockService = mock<AuthenticateService>();
    const mockServiceInstance = instance(mockService);

    when(presenterSpy.service).thenReturn(mockServiceInstance);
  });

  it("tells the view to display a logout message", async () => {
    await mockPresenter.logOut(authToken);
    verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with correct auth token", async () => {
    await mockPresenter.logOut(authToken);
    verify(mockService.logOut(authToken)).once();
  });

  it("tells the view to clear the last info message, clear the user info and navigate to login page", async () => {
    await mockPresenter.logOut(authToken);

    verify(mockView.displayErrorMessage(anything())).never();

    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.clearUserInfo()).once();
    verify(mockView.navigateToLogin()).once();
  });

  it("displays an error message and does not tell the view to clear the last info message, clear the user info and navigate to login page", async () => {
    const error = new Error("test error");
    when(mockService.logOut(anything())).thenThrow(error);

    await mockPresenter.logOut(authToken);

    verify(mockView.displayErrorMessage(anything())).once();

    verify(mockView.clearLastInfoMessage()).never();
    verify(mockView.clearUserInfo()).never();
    verify(mockView.navigateToLogin()).never();
  });
});
