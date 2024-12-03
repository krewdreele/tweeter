import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface AuthenticateDAO {
  login(alias: string, password: string): Promise<[UserDto, AuthTokenDto] | null>;
  logOut(token: string): Promise<void>;
  register(user: UserDto, password: string): Promise<[UserDto, AuthTokenDto] | null>;
  authenticate(token: string): Promise<string>;
}

