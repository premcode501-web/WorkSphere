using System;
using System.ComponentModel.DataAnnotations;

namespace WorkSphere.Application.DTOs
{
    public class EmployeeUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfJoining { get; set; }

        [Required]
        public Guid DepartmentId { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}