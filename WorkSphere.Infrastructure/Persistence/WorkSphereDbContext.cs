using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorkSphere.Domain.Entities;

namespace WorkSphere.Infrastructure.Persistence
{
    public class WorkSphereDbContext : DbContext
    {
        public WorkSphereDbContext(DbContextOptions<WorkSphereDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees => Set<Employee>();

        public DbSet<Department> Departments => Set<Department>();
    }
}
