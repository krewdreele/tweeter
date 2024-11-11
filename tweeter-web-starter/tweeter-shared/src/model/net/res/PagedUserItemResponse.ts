import { UserDto } from "../../dto/UserDto";
import {TweeterResponse} from "../res/TweeterResponse";

export interface PagedItemResponse<T> extends TweeterResponse {
    readonly items: T[] | null,
    readonly hasMore: boolean
}