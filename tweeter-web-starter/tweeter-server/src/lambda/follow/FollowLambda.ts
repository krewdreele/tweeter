import { FollowResponse, UserAliasRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserAliasRequest): Promise<FollowResponse> => {
    const service = new UserService();
    const [followerCount, followeeCount] = await service.follow(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}