import { UserDto } from "../../dto/UserDto";
import {TweeterResponse} from "../res/TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {
    readonly items: UserDto[] | null,
    readonly hasMore: boolean
}