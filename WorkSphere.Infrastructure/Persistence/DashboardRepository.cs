using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Interfaces;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Infrastructure.Persistence
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly WorkSphereDbContext _context;

        public DashboardRepository(WorkSphereDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            // Aggregate employee counts in a single query (grouping by constant)
            var employeeCounts = await _context.Employees
                .GroupBy(e => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(e => e.IsActive)
                })
                .FirstOrDefaultAsync();

            var totalEmployees = employeeCounts?.Total ?? 0;
            var activeEmployees = employeeCounts?.Active ?? 0;
            var inactiveEmployees = totalEmployees - activeEmployees;

            // Departments count (separate, efficient count)
            var totalDepartments = await _context.Departments.CountAsync();

            return new DashboardSummaryDto
            {
                TotalEmployees = totalEmployees,
                ActiveEmployees = activeEmployees,
                InactiveEmployees = inactiveEmployees,
                TotalDepartments = totalDepartments
            };
        }
    }
}
