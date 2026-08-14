using System.Threading.Tasks;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Interfaces;

namespace WorkSphere.Application.Features.Dashboard
{
    public class DashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            return await _dashboardRepository.GetSummaryAsync();
        }
    }
}