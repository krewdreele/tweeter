import { CountResponse, UserAliasRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserAliasRequest
): Promise<CountResponse> => {
  const service = new UserService();
  const count = await service.getFollowerCount(
    request.token,
    request.userAlias
  );

  return {
    success: true,
    message: null,
    count: count,
  };
};
