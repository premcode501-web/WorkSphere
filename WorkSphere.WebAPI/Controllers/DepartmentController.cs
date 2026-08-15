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

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Department>> Update(Guid id, [FromBody] DepartmentUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _departmentService.UpdateAsync(id, updateDto);

            if (updated is null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _departmentService.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}