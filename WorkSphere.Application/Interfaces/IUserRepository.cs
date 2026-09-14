using WorkSphere.Domain.Entities;

namespace WorkSphere.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string normalizedEmail);

    Task<User?> GetByIdentifierAsync(string? email, string? userName);

    Task AddAsync(User user);
}
