using System.ComponentModel.DataAnnotations;

namespace WorkSphere.Application.DTOs;

public class UserCreateDto
{
    [StringLength(100)]
    public string? UserName { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}
