using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Interfaces;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Application.Features.Departments
{
    public class DepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<List<Department>> GetAllAsync()
        {
            return await _departmentRepository.GetAllAsync();
        }

        public async Task<Department?> GetByIdAsync(Guid id)
        {
            return await _departmentRepository.GetByIdAsync(id);
        }

        public async Task<Department> AddAsync(DepartmentCreateDto dto)
        {
            var department = new Department
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Code = dto.Code,
                Description = dto.Description ?? string.Empty,
                IsActive = true,
                CreatedOn = DateTime.UtcNow
            };

            await _departmentRepository.AddAsync(department);

            return department;
        }
    }
}