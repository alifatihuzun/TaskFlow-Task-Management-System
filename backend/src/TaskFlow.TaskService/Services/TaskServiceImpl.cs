using Microsoft.EntityFrameworkCore;
using TaskFlow.TaskService.Data;
using TaskFlow.TaskService.DTOs;
using TaskFlow.TaskService.Enums;
using TaskFlow.TaskService.Models;

namespace TaskFlow.TaskService.Services;

public class TaskServiceImpl : ITaskService
{
    private readonly TaskDbContext _context;

    public TaskServiceImpl(TaskDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskResponseDto>> GetTasksAsync(Guid userId, string? status = null, string? priority = null)
    {
        var query = _context.Tasks.Where(t => t.AssignedUserId == userId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<TaskItemStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(t => t.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(priority) && Enum.TryParse<TaskPriority>(priority, true, out var parsedPriority))
        {
            query = query.Where(t => t.Priority == parsedPriority);
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => MapToDto(t))
            .ToListAsync();
    }

    public async Task<TaskResponseDto> GetTaskByIdAsync(Guid taskId, Guid userId)
    {
        var task = await _context.Tasks.FindAsync(taskId)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        if (task.AssignedUserId != userId)
            throw new UnauthorizedAccessException("Bu göreve erişim yetkiniz yok.");

        return MapToDto(task);
    }

    public async Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto, Guid userId)
    {
        if (!Enum.TryParse<TaskPriority>(dto.Priority, true, out var priority))
            throw new ArgumentException($"Geçersiz öncelik değeri: {dto.Priority}");

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Priority = priority,
            Status = TaskItemStatus.Todo,
            DueDate = dto.DueDate,
            CreatedAt = DateTime.UtcNow,
            AssignedUserId = userId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<TaskResponseDto> UpdateTaskAsync(Guid taskId, TaskUpdateDto dto, Guid userId)
    {
        var task = await _context.Tasks.FindAsync(taskId)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        if (task.AssignedUserId != userId)
            throw new UnauthorizedAccessException("Bu görevi güncelleme yetkiniz yok.");

        if (!Enum.TryParse<TaskPriority>(dto.Priority, true, out var priority))
            throw new ArgumentException($"Geçersiz öncelik değeri: {dto.Priority}");

        if (!Enum.TryParse<TaskItemStatus>(dto.Status, true, out var status))
            throw new ArgumentException($"Geçersiz durum değeri: {dto.Status}");

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = priority;
        task.Status = status;
        task.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task DeleteTaskAsync(Guid taskId, Guid userId)
    {
        var task = await _context.Tasks.FindAsync(taskId)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        if (task.AssignedUserId != userId)
            throw new UnauthorizedAccessException("Bu görevi silme yetkiniz yok.");

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }

    private static TaskResponseDto MapToDto(TaskItem task)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority.ToString(),
            Status = task.Status.ToString(),
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            AssignedUserId = task.AssignedUserId
        };
    }
}
