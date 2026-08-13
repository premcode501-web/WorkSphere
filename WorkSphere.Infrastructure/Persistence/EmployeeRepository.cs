using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorkSphere.Application.Interfaces;
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
    }
}
