import api from './api';
import type { LoginDto, RegisterDto, AuthResponseDto } from '../types';

export const authService = {
    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const response = await api.post<AuthResponseDto>('/auth/login', dto);
        return response.data;
    },

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        const response = await api.post<AuthResponseDto>('/auth/register', dto);
        return response.data;
    },
};
