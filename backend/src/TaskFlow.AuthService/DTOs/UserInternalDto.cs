namespace TaskFlow.AuthService.DTOs;

/// <summary>
/// UserService'ten gelen kullanıcı verisini deserialize etmek için.
/// PasswordHash dahil — login sırasında şifre doğrulama için gerekli.
/// </summary>
public class UserInternalDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
