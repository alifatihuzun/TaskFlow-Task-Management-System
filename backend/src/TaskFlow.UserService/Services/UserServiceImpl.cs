using Microsoft.EntityFrameworkCore;
using TaskFlow.UserService.Data;
using TaskFlow.UserService.DTOs;
using TaskFlow.UserService.Models;

namespace TaskFlow.UserService.Services;

public class UserServiceImpl : IUserService
{
    private readonly UserDbContext _context;

    public UserServiceImpl(UserDbContext context)
    {
        _context = context;
    }

    public async Task<UserResponseDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role.ToString()
            })
            .ToListAsync();
    }

    public async Task<UserInternalDto?> GetByEmailAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email.ToLower());

        if (user is null) return null;

        return new UserInternalDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            Role = user.Role.ToString()
        };
    }

    public async Task<UserInternalDto> CreateUserAsync(UserCreateDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

        if (existingUser is not null)
            throw new InvalidOperationException("Bu e-posta adresi zaten kayıtlı.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email.ToLower(),
            PasswordHash = dto.PasswordHash,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserInternalDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            Role = user.Role.ToString()
        };
    }
}
