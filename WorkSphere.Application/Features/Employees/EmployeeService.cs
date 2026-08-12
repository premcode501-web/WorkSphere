using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkSphere.Application.Interfaces;
using WorkSphere.Domain.Entities;
using WorkSphere.Application.DTOs;

namespace WorkSphere.Application.Features.Employees
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<List<EmployeeResponseDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();

            return employees
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(Guid id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee is null)
                return null;

            return MapToResponseDto(employee);
        }

        // Preserve original overload for existing internal callers (if any)
        public async Task AddAsync(Employee employee)
        {
            employee.Id = Guid.NewGuid();
            employee.CreatedOn = DateTime.UtcNow;

            await _employeeRepository.AddAsync(employee);
        }

        // New: accept DTO, map to domain entity, keep business logic here
        public async Task<Employee> AddAsync(EmployeeCreateDto dto)
        {
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                EmployeeCode = dto.EmployeeCode,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                DateOfJoining = DateOnly.FromDateTime(dto.DateOfJoining),
                IsActive = true,
                DepartmentId = dto.DepartmentId,
                CreatedOn = DateTime.UtcNow
            };

            await _employeeRepository.AddAsync(employee);

            return employee;
        }

        private static EmployeeResponseDto MapToResponseDto(Employee e)
        {
            return new EmployeeResponseDto
            {
                Id = e.Id,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                PhoneNumber = e.PhoneNumber,
                DateOfJoining = e.DateOfJoining,
                IsActive = e.IsActive,
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department?.Name ?? string.Empty,
                DepartmentCode = e.Department?.Code ?? string.Empty
            };
        }
    }
}
