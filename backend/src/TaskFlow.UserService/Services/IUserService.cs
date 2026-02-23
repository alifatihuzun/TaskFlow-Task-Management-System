using TaskFlow.UserService.DTOs;

namespace TaskFlow.UserService.Services;

public interface IUserService
{
    Task<UserResponseDto> GetCurrentUserAsync(Guid userId);
    Task<List<UserResponseDto>> GetAllUsersAsync();
    Task<UserInternalDto?> GetByEmailAsync(string email);
    Task<UserInternalDto> CreateUserAsync(UserCreateDto dto);
}
