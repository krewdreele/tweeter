import { UserAliasRequest } from "./UserAliasRequest";

export interface IsFollowerRequest extends UserAliasRequest{
    readonly selectedUserAlias: string
}