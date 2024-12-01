import { AuthenticateResponse, AuthTokenDto, RegisterRequest, UserDto } from "tweeter-shared";
import { AuthenticateService } from "../../model/service/AuthenticateService";

export const handler = async (
  request: RegisterRequest
): Promise<AuthenticateResponse> => {
  const service = new AuthenticateService();
  let response: [UserDto, AuthTokenDto] | null = null;
  let message = null;

  try {
    response = await service.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBase64,
      request.imageFileExtension
    );
  } catch (error: any) {
    message = error?.message;
  }

  if (response) {
    return {
      success: true,
      message: null,
      user: response[0],
      authToken: response[1],
    };
  }

  return {
    success: false,
    message: message,
    user: null,
    authToken: null,
  };
};
