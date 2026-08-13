using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkSphere.Domain.Entities;
using WorkSphere.Application.DTOs;

namespace WorkSphere.Application.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetByIdAsync(Guid id);

        Task<List<Employee>> GetAllAsync();

        Task AddAsync(Employee employee);

        Task UpdateAsync(Employee employee);

        Task DeleteAsync(Employee employee);

        // New: paged search. Returns items + total count so Application layer can compute pagination.
        Task<(List<Employee> Items, int TotalCount)> GetPagedAsync(EmployeeQueryParameters query);
    }
}
