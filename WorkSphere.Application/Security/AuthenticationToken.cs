namespace WorkSphere.Application.Security;

public sealed class AuthenticationToken
{
    public AuthenticationToken(string token, DateTime expiresAtUtc)
    {
        Token = token;
        ExpiresAtUtc = expiresAtUtc;
    }

    public string Token { get; }

    public DateTime ExpiresAtUtc { get; }
}
