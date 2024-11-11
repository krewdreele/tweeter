import { AuthenticateResponse, LoginRequest, RegisterRequest } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export const handler = async (
  request: RegisterRequest
): Promise<AuthenticateResponse> => {
  const service = new AuthenticateService();
  const [user, token] = await service.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBase64, request.imageFileExtension);

  return {
    success: true,
    message: null,
    user: user,
    authToken: token,
  };
};
