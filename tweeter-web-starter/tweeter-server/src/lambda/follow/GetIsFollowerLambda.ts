import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const service = new UserService();
    const isFollower = await service.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias);

    return {
        success: true,
        message: null,
        isFollower: isFollower
    }
}