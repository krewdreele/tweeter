import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const service = new StatusService();
  const [items, hasMore] = await service.loadMoreStoryItems(
    request.userAlias,
    request.token,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
