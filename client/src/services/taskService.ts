import api from './api';
import type {
    TaskCreateDto,
    TaskUpdateDto,
    TaskResponseDto,
} from '../types';

export const taskService = {
    async getTasks(status?: string, priority?: string): Promise<TaskResponseDto[]> {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        const response = await api.get<TaskResponseDto[]>(`/tasks?${params.toString()}`);
        return response.data;
    },

    async getTaskById(id: string): Promise<TaskResponseDto> {
        const response = await api.get<TaskResponseDto>(`/tasks/${id}`);
        return response.data;
    },

    async createTask(dto: TaskCreateDto): Promise<TaskResponseDto> {
        const response = await api.post<TaskResponseDto>('/tasks', dto);
        return response.data;
    },

    async updateTask(id: string, dto: TaskUpdateDto): Promise<TaskResponseDto> {
        const response = await api.put<TaskResponseDto>(`/tasks/${id}`, dto);
        return response.data;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },
};
