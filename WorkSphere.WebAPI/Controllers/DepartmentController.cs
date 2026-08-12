using Microsoft.AspNetCore.Mvc;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Features.Departments;
using WorkSphere.Domain.Entities;

namespace WorkSphere.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : Controller
    {
        private readonly DepartmentService _departmentService;

        public DepartmentController(DepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Department>>> GetAll()
        {
            var departments = await _departmentService.GetAllAsync();
            return Ok(departments);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Department>> GetById(Guid id)
        {
            var department = await _departmentService.GetByIdAsync(id);

            if (department is null)
                return NotFound();

            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> Create([FromBody] DepartmentCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _departmentService.AddAsync(createDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }
    }
}