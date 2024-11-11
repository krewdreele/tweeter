import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  userImageBase64: string;
  imageFileExtension: string;
}