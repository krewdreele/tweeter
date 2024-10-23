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
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/Status/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPresenter: PostStatusPresenter;
  let mockView: PostStatusView;
  let mockService: StatusService;

  const authToken = new AuthToken("abc123", 0);
  const currentUser = new User("Test", "User", "testuser", "none");
  const post = "this is the post";

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const viewInstance = instance(mockView);

    const presenterSpy = spy(new PostStatusPresenter(viewInstance));
    mockPresenter = instance(presenterSpy);

    mockService = mock<StatusService>();
    const mockServiceInstance = instance(mockService);

    when(presenterSpy.service).thenReturn(mockServiceInstance);
  });

  it("calls post status service with correct authentication token and string", async () => {
    await mockPresenter.submitPost(authToken, post, currentUser);

    let [capturedToken, capturedStatus] = capture(
      mockService.postStatus
    ).last();
    expect(capturedToken).toEqual(authToken);
    expect(capturedStatus.post).toBe(post);
  });

  it("tells the view to clear the last info message, clear the post and display the status posted message when successful", async () => {
    await mockPresenter.submitPost(authToken, post, currentUser);

    verify(mockView.setIsLoading(true)).once();
    verify(mockView.setPost("")).once();
    verify(mockView.displayInfoMessage(anything(), anything())).twice();
    verify(mockView.clearLastInfoMessage()).once();
  });

  it("tells the view to display an error message and clear the last info message when failure", async () => {
    const error = new Error("test error");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await mockPresenter.submitPost(authToken, post, currentUser);

    verify(mockView.displayErrorMessage(anything())).once();
    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.setPost("")).never();
    verify(mockView.displayInfoMessage(anything(), anything())).once();
  });
});
