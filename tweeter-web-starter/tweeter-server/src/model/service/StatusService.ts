import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreStoryItems(
    userAlias: string,
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const response = await this.DaoFactory.getStatusDao().loadMoreStoryItems(
      userAlias,
      pageSize,
      lastItem
    );

    return response;
  }

  public async loadMoreFeedItems(
    userAlias: string,
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const response = await this.DaoFactory.getStatusDao().loadMoreFeedItems(
      userAlias,
      pageSize,
      lastItem
    );

    return response;
  }

  private convertToDtos(items: Status[]) {
    const userDtos = items.map((status) => status.user.dto);
    const dtos = items.map((status) => status.dto);

    dtos.forEach((status, index) => {
      status.user = userDtos[index];
    });

    return dtos;
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.DaoFactory.getStatusDao().postStatus(newStatus);
  }
}
