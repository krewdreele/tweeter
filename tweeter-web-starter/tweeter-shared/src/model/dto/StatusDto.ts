import { UserDto } from "./UserDto";

export interface StatusDto {
    post: string,
    user: UserDto,
    timestamp: number,
}
