/**
 * Authentication Data Transfer Objects (DTOs)
 */

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface VerifyOtpDto extends RegisterDto {
    otp: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

/**
 * Backend Response Interfaces
 */

export interface AuthUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUserResponse;
}
