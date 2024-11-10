import { TweeterRequest } from "./TweeterRequest";

export interface UserAliasRequest extends TweeterRequest{
    readonly userAlias: string
}