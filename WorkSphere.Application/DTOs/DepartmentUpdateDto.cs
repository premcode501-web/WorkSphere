using System.ComponentModel.DataAnnotations;

namespace WorkSphere.Application.DTOs
{
    public class DepartmentUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }
}
