using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorkSphere.Application.Interfaces;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Infrastructure.Persistence
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly WorkSphereDbContext _context;

        public DepartmentRepository(WorkSphereDbContext context)
        {
            _context = context;
        }

        public async Task<Department?> GetByIdAsync(Guid id)
        {
            return await _context.Departments
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Department>> GetAllAsync()
        {
            return await _context.Departments
                .ToListAsync();
        }

        public async Task AddAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Department department)
        {
            _context.Departments.Update(department);
            await _context.SaveChangesAsync();
        }
    }
}