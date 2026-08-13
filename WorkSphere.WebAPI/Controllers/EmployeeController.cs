using Microsoft.AspNetCore.Mvc;
using WorkSphere.Application.Features.Employees;
using WorkSphere.Application.DTOs;

namespace WorkSphere.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        private readonly EmployeeService _employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // Updated: supports search, paging via query parameters
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<EmployeeResponseDto>>> Get([FromQuery] EmployeeQueryParameters query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var paged = await _employeeService.GetPagedAsync(query);

            return Ok(paged);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EmployeeResponseDto>> GetById(Guid id)
        {
            var employee = await _employeeService.GetByIdAsync(id);

            if (employee is null)
                return NotFound();

            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] EmployeeCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _employeeService.AddAsync(createDto);

            var response = await _employeeService.GetByIdAsync(created.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                response);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<EmployeeResponseDto>> Update(Guid id, [FromBody] EmployeeUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _employeeService.UpdateAsync(id, updateDto);

            if (updated is null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _employeeService.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
