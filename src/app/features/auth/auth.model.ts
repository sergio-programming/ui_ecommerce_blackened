import { User, UserSession } from "../user/user.model";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    accessToken: string;
    user: UserSession
}

export interface AuthSession {
    accessToken: string;
    user: UserSession;
}