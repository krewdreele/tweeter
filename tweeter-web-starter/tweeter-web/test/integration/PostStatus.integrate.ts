import { LoginRequest, PagedItemRequest, Status, StatusDto } from "tweeter-shared";
import { AuthenticateService } from "../../src/model/service/AuthenticateService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/Status/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";


describe("Post Status Integration Test", () => {
    it("Logs into a real account, posts a status, checks story", async () => {
        const authService = new AuthenticateService();
        const req: LoginRequest = {
          alias: "ds",
          password: "123",
          token: "",
        };

        const [user, token] = await authService.login(req);

        const mockView = mock<PostStatusView>();

        const viewInstance = instance(mockView);

        const presenter = new PostStatusPresenter(viewInstance);

        const post = "hello world";

        await presenter.submitPost(token, post, user);

        verify(mockView.displayInfoMessage("Status posted!", 2000));

        const statusService = new StatusService();

        const storyRequest: PagedItemRequest<StatusDto> = {
          userAlias: user.alias,
          pageSize: 10,
          lastItem: null,
          token: token.token,
        };

        const [statuses, hasMore] = await statusService.loadMoreStoryItems(
          storyRequest
        );

        expect(statuses[statuses.length - 1].post).toBe(post);
        expect(statuses[statuses.length - 1].user.alias).toBe("@" + user.alias);
    }, 100000000);
});