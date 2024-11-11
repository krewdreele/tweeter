import { Status, FakeData, StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreStoryItems(
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling db
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    const dtos = this.convertToDtos(items);
    return [dtos, hasMore];
  }

  public async loadMoreFeedItems(
    token: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling db
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = this.convertToDtos(items);

    return [dtos, hasMore];
  }

  private convertToDtos(items: Status[]){
    const userDtos = items.map((status) => status.user.dto);
    const dtos = items.map((status) => status.dto);

    dtos.forEach((status, index) => {
      status.user = userDtos[index];
    });

    return dtos;
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {

    // TODO: Call the db to post the status
    const status = Status.fromDto(newStatus);
    return
  }
}
