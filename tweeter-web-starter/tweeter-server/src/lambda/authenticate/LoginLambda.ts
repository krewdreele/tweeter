import { AuthenticateResponse, LoginRequest } from "tweeter-shared"
import { AuthenticateService } from "../../model/service/AuthenticateService"

export const handler = async (request: LoginRequest): Promise<AuthenticateResponse> => {
    const service = new AuthenticateService();

    let response = null;
    let message = null;

    try {
        response = await service.login(request.alias, request.password);
    }
    catch(error: any){
        message = error?.message;
    }

    if(response){
        return {
            success: true,
            message: null,
            user: response[0],
            authToken: response[1]
        }
    }

    return {
      success: false,
      message: message,
      user: null,
      authToken: null,
    };
}