using Microsoft.EntityFrameworkCore;
using WorkSphere.Application.Interfaces;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Infrastructure.Persistence;

public class UserRepository : IUserRepository
{
    private readonly WorkSphereDbContext _context;

    public UserRepository(WorkSphereDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string normalizedEmail)
    {
        return await _context.Users
            .FirstOrDefaultAsync(user =>
                user.NormalizedEmail == normalizedEmail ||
                user.Email.ToUpper() == normalizedEmail);
    }

    public async Task<User?> GetByIdentifierAsync(string? email, string? userName)
    {
        var normalizedEmail = string.IsNullOrWhiteSpace(email)
            ? null
            : email.Trim().ToUpperInvariant();
        var normalizedUserName = string.IsNullOrWhiteSpace(userName)
            ? null
            : userName.Trim().ToUpperInvariant();

        return await _context.Users.FirstOrDefaultAsync(user =>
            (normalizedEmail != null &&
             (user.NormalizedEmail == normalizedEmail ||
              user.Email.ToUpper() == normalizedEmail)) ||
            (normalizedUserName != null &&
             user.UserName.ToUpper() == normalizedUserName));
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}
