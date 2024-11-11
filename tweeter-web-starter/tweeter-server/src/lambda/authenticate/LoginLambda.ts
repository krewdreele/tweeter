import { AuthenticateResponse, LoginRequest } from "tweeter-shared"
import { AuthenticateService } from "../../model/service/AuthenticateService"

export const handler = async (request: LoginRequest): Promise<AuthenticateResponse> => {
    const service = new AuthenticateService();
    const [user, token] = await service.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user: user,
        authToken: token
    }
}