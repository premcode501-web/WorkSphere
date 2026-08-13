using System.ComponentModel.DataAnnotations;

namespace WorkSphere.Application.DTOs
{
    public class EmployeeQueryParameters
    {
        [StringLength(200)]
        public string? Search { get; set; }

        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 10;
    }
}