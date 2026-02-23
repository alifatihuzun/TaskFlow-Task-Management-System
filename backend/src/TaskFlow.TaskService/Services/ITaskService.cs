using TaskFlow.TaskService.DTOs;

namespace TaskFlow.TaskService.Services;

public interface ITaskService
{
    Task<List<TaskResponseDto>> GetTasksAsync(Guid userId, string? status = null, string? priority = null);
    Task<TaskResponseDto> GetTaskByIdAsync(Guid taskId, Guid userId);
    Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto, Guid userId);
    Task<TaskResponseDto> UpdateTaskAsync(Guid taskId, TaskUpdateDto dto, Guid userId);
    Task DeleteTaskAsync(Guid taskId, Guid userId);
}
