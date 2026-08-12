using System;

namespace WorkSphere.Application.DTOs
{
    public class EmployeeResponseDto
    {
        public Guid Id { get; set; }

        public string EmployeeCode { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public DateOnly DateOfJoining { get; set; }

        public bool IsActive { get; set; }

        public Guid DepartmentId { get; set; }

        public string DepartmentName { get; set; } = string.Empty;

        public string DepartmentCode { get; set; } = string.Empty;
    }
}