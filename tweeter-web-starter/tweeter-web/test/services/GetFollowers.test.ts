import { PagedItemRequest, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

test("Get Followers", async() => {
    const request: PagedItemRequest<UserDto> = {
        userAlias: "@Allen",
        pageSize: 10,
        lastItem: null,
        token: ""
    }

    const serverFacade = new ServerFacade();

    const [users, hasMore] = await serverFacade.getMoreUserItems(request, "follower");

    expect(users).toHaveLength(10);
    expect(hasMore).toBeTruthy();
})