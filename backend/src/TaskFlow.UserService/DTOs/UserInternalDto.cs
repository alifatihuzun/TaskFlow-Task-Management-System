namespace TaskFlow.UserService.DTOs;

/// <summary>
/// Internal DTO — AuthService'in login sırasında PasswordHash'e erişmesi için.
/// Dış API'lerde kullanılmamalı.
/// </summary>
public class UserInternalDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
