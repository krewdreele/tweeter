import { PagedItemRequest, Status, StatusDto, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

test("Get Story", async () => {
  const request: PagedItemRequest<StatusDto> = {
    userAlias: "@Allen",
    pageSize: 10,
    lastItem: null,
    token: "",
  };

  const serverFacade = new ServerFacade();

  const [statuses, hasMore] = await serverFacade.getMoreStatusItems(
    request,
    "story"
  );

  expect(statuses).toHaveLength(10);
  expect(hasMore).toBeTruthy();
});
