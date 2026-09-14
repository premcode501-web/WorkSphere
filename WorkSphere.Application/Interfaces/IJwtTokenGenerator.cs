using WorkSphere.Application.Security;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Application.Interfaces;

public interface IJwtTokenGenerator
{
    AuthenticationToken Generate(User user);
}
