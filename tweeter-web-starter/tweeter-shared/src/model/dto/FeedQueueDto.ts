import { StatusQueueDto } from "./StatusQueueDto";

export interface FeedQueueDto {
    status: StatusQueueDto;
    users: string[];
}