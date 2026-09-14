using System.ComponentModel.DataAnnotations;

namespace WorkSphere.Application.DTOs;

public class LoginRequestDto
{
    [EmailAddress]
    [StringLength(256)]
    public string? Email { get; set; }

    [StringLength(100)]
    public string? UserName { get; set; }

    [Required]
    public string Password { get; set; } = string.Empty;
}
