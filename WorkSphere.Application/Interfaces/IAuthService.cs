using WorkSphere.Application.DTOs;

namespace WorkSphere.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

    Task CreateUserAsync(UserCreateDto request);
}
