import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserAliasRequest,
  UserDto,
  UserItemResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://8dmtk68jtf.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreUserItems(
    request: PagedUserItemRequest,
    type: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, `/${type}/list`);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${type} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }

  public async getUser(
    request: UserAliasRequest,
  ): Promise<User> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      UserItemResponse
    >(request, `/user`);

    const user = response.user ? User.fromDto(response.user) : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "unknown error");
    }
  }
}
