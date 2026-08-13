using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorkSphere.Application.Interfaces;
using WorkSphere.Application.DTOs;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Infrastructure.Persistence
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly WorkSphereDbContext _context;

        public EmployeeRepository(WorkSphereDbContext context)
        {
            _context = context;
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            return await _context.Employees
                .Include(x => x.Department)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(x => x.Department)
                .ToListAsync();
        }

        public async Task AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Employee employee)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        public async Task<(List<Employee> Items, int TotalCount)> GetPagedAsync(EmployeeQueryParameters query)
        {
            // Build queryable so filtering and paging happen in DB
            var q = _context.Employees
                .Include(e => e.Department)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.Trim();
                q = q.Where(e =>
                    e.EmployeeCode.Contains(s) ||
                    e.FirstName.Contains(s) ||
                    e.LastName.Contains(s) ||
                    e.Email.Contains(s));
            }

            var totalCount = await q.CountAsync();

            // Provide deterministic ordering for paging
            var items = await q
                .OrderBy(e => e.EmployeeCode)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
