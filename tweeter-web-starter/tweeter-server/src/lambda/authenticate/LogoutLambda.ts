import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  const service = new AuthenticateService();
  await service.logOut(request.token);

  return {
    success: true,
    message: null,
  };
};
