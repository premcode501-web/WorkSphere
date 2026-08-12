using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Application.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<Department?> GetByIdAsync(Guid id);

        Task<List<Department>> GetAllAsync();

        Task AddAsync(Department department);

        Task UpdateAsync(Department department);
    }
}