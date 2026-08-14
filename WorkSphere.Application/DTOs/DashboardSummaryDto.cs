using System;

namespace WorkSphere.Application.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalEmployees { get; set; }

        public int ActiveEmployees { get; set; }

        public int InactiveEmployees { get; set; }

        public int TotalDepartments { get; set; }
    }
}   