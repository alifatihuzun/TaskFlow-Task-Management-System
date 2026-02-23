using Microsoft.EntityFrameworkCore;
using TaskFlow.TaskService.Data;
using TaskFlow.TaskService.DTOs;
using TaskFlow.TaskService.Enums;
using TaskFlow.TaskService.Services;

namespace TaskFlow.TaskService.Tests;

public class TaskServiceTests
{
    private TaskDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TaskDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TaskDbContext(options);
    }

    [Fact]
    public async Task CreateTask_WithValidDto_ReturnsTask()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var userId = Guid.NewGuid();
        var dto = new TaskCreateDto
        {
            Title = "Test Görev",
            Description = "Açıklama",
            Priority = "High",
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        // Act
        var result = await service.CreateTaskAsync(dto, userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Görev", result.Title);
        Assert.Equal("High", result.Priority);
        Assert.Equal("Todo", result.Status);
        Assert.Equal(userId, result.AssignedUserId);
    }

    [Fact]
    public async Task GetTasks_ReturnsOnlyUserTasks()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();

        await service.CreateTaskAsync(new TaskCreateDto { Title = "User1 Task", Priority = "Medium" }, userId1);
        await service.CreateTaskAsync(new TaskCreateDto { Title = "User2 Task", Priority = "Low" }, userId2);

        // Act
        var user1Tasks = await service.GetTasksAsync(userId1);
        var user2Tasks = await service.GetTasksAsync(userId2);

        // Assert
        Assert.Single(user1Tasks);
        Assert.Equal("User1 Task", user1Tasks[0].Title);
        Assert.Single(user2Tasks);
        Assert.Equal("User2 Task", user2Tasks[0].Title);
    }

    [Fact]
    public async Task UpdateTask_OwnedByUser_Succeeds()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var userId = Guid.NewGuid();

        var created = await service.CreateTaskAsync(
            new TaskCreateDto { Title = "Eski Başlık", Priority = "Low" }, userId);

        var updateDto = new TaskUpdateDto
        {
            Title = "Yeni Başlık",
            Description = "Güncelleme",
            Priority = "Critical",
            Status = "InProgress",
            DueDate = DateTime.UtcNow.AddDays(3)
        };

        // Act
        var updated = await service.UpdateTaskAsync(created.Id, updateDto, userId);

        // Assert
        Assert.Equal("Yeni Başlık", updated.Title);
        Assert.Equal("Critical", updated.Priority);
        Assert.Equal("InProgress", updated.Status);
    }

    [Fact]
    public async Task DeleteTask_NotOwnedByUser_ThrowsException()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var created = await service.CreateTaskAsync(
            new TaskCreateDto { Title = "Sahip Görev", Priority = "Medium" }, ownerId);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.DeleteTaskAsync(created.Id, otherUserId));
    }

    [Fact]
    public async Task GetTaskById_NotOwnedByUser_ThrowsException()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var created = await service.CreateTaskAsync(
            new TaskCreateDto { Title = "Gizli Görev", Priority = "High" }, ownerId);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.GetTaskByIdAsync(created.Id, otherUserId));
    }

    [Fact]
    public async Task CreateTask_WithInvalidPriority_ThrowsArgumentException()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var userId = Guid.NewGuid();
        var dto = new TaskCreateDto
        {
            Title = "Test",
            Priority = "InvalidPriority"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.CreateTaskAsync(dto, userId));
    }

    [Fact]
    public async Task GetTasks_FilterByStatus_ReturnsFilteredTasks()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new TaskServiceImpl(context);
        var userId = Guid.NewGuid();

        var created = await service.CreateTaskAsync(
            new TaskCreateDto { Title = "Task 1", Priority = "Medium" }, userId);

        await service.UpdateTaskAsync(created.Id, new TaskUpdateDto
        {
            Title = "Task 1",
            Priority = "Medium",
            Status = "Done"
        }, userId);

        await service.CreateTaskAsync(
            new TaskCreateDto { Title = "Task 2", Priority = "Low" }, userId);

        // Act
        var doneTasks = await service.GetTasksAsync(userId, status: "Done");
        var todoTasks = await service.GetTasksAsync(userId, status: "Todo");

        // Assert
        Assert.Single(doneTasks);
        Assert.Equal("Task 1", doneTasks[0].Title);
        Assert.Single(todoTasks);
        Assert.Equal("Task 2", todoTasks[0].Title);
    }
}
