export type UserRoles = 'admin' | 'staff' | 'user';

export interface User {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    role: UserRoles;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreate {
    fullName: string;
    email: string;
    password: string;
    role: string;
}

export interface UserUpdate {
    fullName: string;
    email: string;
    role: string;
}

export interface UserEditInfo {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface UserRegister {
    fullName: string;
    email: string;
    password: string;
}

export interface UserResponse {
    message: string;
    user: User
}

export interface UserSession {
    id: string;
    email: string;
    role: string;
}
