using Microsoft.AspNetCore.Mvc;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Features.Dashboard;

namespace WorkSphere.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // GET: /api/Dashboard/summary
        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var summary = await _dashboardService.GetSummaryAsync();
            return Ok(summary);
        }
    }
}
