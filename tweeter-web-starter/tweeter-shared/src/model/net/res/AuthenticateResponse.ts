import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthenticateResponse extends TweeterResponse {
    user: UserDto | null;
    authToken: AuthTokenDto | null;
}