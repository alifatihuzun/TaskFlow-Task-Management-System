using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskFlow.AuthService.DTOs;

namespace TaskFlow.AuthService.Services;

public class AuthServiceImpl : IAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AuthServiceImpl(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Şifreyi hashle
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // UserService'e kullanıcı oluşturma isteği at
        var createDto = new
        {
            dto.FullName,
            dto.Email,
            PasswordHash = passwordHash
        };

        var response = await _httpClient.PostAsJsonAsync("/api/users/internal", createDto);

        if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
        {
            var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
            throw new InvalidOperationException(error?.Message ?? "Bu e-posta adresi zaten kayıtlı.");
        }

        response.EnsureSuccessStatusCode();

        var user = await response.Content.ReadFromJsonAsync<UserInternalDto>()
            ?? throw new InvalidOperationException("UserService'ten geçersiz yanıt.");

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // UserService'ten email ile kullanıcıyı getir
        var response = await _httpClient.GetAsync($"/api/users/internal/by-email/{dto.Email.ToLower()}");

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

        response.EnsureSuccessStatusCode();

        var user = await response.Content.ReadFromJsonAsync<UserInternalDto>()
            ?? throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

        // Şifre doğrula
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };
    }

    private string GenerateJwtToken(UserInternalDto user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpirationInHours"]!)),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private record ErrorResponse(string Message);
}
