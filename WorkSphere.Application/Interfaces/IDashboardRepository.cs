using System.Threading.Tasks;
using WorkSphere.Application.DTOs;

namespace WorkSphere.Application.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }
}