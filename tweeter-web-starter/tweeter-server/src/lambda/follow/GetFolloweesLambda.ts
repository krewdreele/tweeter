import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const userService = new UserService();
    const [items, hasMore] = await userService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}