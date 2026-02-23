using TaskFlow.AuthService.DTOs;

namespace TaskFlow.AuthService.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}
