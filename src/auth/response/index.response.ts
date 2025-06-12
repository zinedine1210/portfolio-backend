import { Role } from "@prisma/client";

export interface RegisterResponse {
    id: string,
    email: string,
    role: Role
}

export interface LoginResponse {
    access_token: string
}