import { Role } from "@prisma/client";

export interface RegisterResponse {
    id: number,
    email: string,
    name: string,
    role: Role
}

export interface LoginResponse {
    access_token: string
}