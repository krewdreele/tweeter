import { AuthToken, Status, FakeData, PagedItemRequest, StatusDto, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private server = new ServerFacade();

  public async loadMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return await this.server.getMoreStatusItems(request, "story");
  }

  public async loadMoreFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return await this.server.getMoreStatusItems(request, "feed");
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<void> {
    
    return await this.server.postStatus(request);
  }
}
