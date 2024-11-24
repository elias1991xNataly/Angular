import { LoginResponse } from "@/app/models/auth.model";

export const AuthAdapter = (loginData: LoginResponse) => ({
    accessToken:loginData.accessToken,
    refreshToken:loginData.refreshToken
});