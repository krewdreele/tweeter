import { PagedItemRequest, User, UserAliasRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

test("Get Follower Count", async () => {
  const request: UserAliasRequest = {
      userAlias: "@Allen",
      token: ""
  };

  const serverFacade = new ServerFacade();

  const count = await serverFacade.getCount(
    request,
    "follower"
  );

  expect(count).toBeTruthy();
});
