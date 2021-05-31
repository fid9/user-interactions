import { ErrorType } from "../enums";

export interface CreateUserResponse {
    username?: string;
    error?: ErrorType;
}