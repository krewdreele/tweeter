import { UserItemResponse, UserAliasRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserAliasRequest): Promise<UserItemResponse> => {
    const userService = new UserService();
    const userDto = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        user: userDto,
        message: null
    }
}