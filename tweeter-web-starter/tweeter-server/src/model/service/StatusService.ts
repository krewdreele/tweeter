import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreStoryItems(
    userAlias: string,
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }
    const [statuses, hasMore] = await this.DaoFactory.getStatusDao().loadMoreStoryItems(
      userAlias,
      pageSize,
      lastItem
    );

    const returnedStatuses = this.returnStatusesWithAtSymbol(statuses);

    return [returnedStatuses, hasMore];
  }

  public async loadMoreFeedItems(
    userAlias: string,
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {

    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    const [statuses, hasMore] =
      await this.DaoFactory.getStatusDao().loadMoreFeedItems(
        userAlias,
        pageSize,
        lastItem
      );

    const returnedStatuses = this.returnStatusesWithAtSymbol(statuses);

    return [returnedStatuses, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const user = await this.DaoFactory.getAuthDao().authenticate(token);

    if (!user) {
      throw new Error("Unauthenticated");
    }
    await this.DaoFactory.getStatusDao().postStatus(newStatus);
  }
}
