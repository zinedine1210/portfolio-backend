import { Role } from "@prisma/client";

export interface UserResponse {
    id: number,
    email: string,
    role: Role
}