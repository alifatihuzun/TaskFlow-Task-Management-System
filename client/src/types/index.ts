export interface AuthResponseDto {
    token: string;
    fullName: string;
    email: string;
    role: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export interface TaskCreateDto {
    title: string;
    description: string;
    priority: string;
    dueDate?: string | null;
}

export interface TaskUpdateDto {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate?: string | null;
}

export interface TaskResponseDto {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string | null;
    createdAt: string;
    assignedUserId: string;
}

export interface AuthUser {
    token: string;
    fullName: string;
    email: string;
    role: string;
}
