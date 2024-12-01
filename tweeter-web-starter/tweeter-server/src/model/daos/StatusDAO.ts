import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
  loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  postStatus(newStatus: StatusDto): Promise<void>;
}