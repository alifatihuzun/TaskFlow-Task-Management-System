import api from './api';
import type { UserResponseDto } from '../types';

export const userService = {
    async getCurrentUser(): Promise<UserResponseDto> {
        const response = await api.get<UserResponseDto>('/users/me');
        return response.data;
    },

    async getAllUsers(): Promise<UserResponseDto[]> {
        const response = await api.get<UserResponseDto[]>('/users');
        return response.data;
    },
};
