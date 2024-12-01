import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  const service = new AuthenticateService();

  try {
    await service.logOut(request.token);
  }
  catch(error: any) {
    return {
      success: false,
      message: error?.message
    }
  }

  return {
    success: true,
    message: null,
  };
};
