
using EmployeeAdministrator.Modules.AuthModule.DTOs;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using EmployeeAdministrator.Modules.TasksModule.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace EmployeeAdministrator.DataLayer
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Project> Projects { get; set; }

        public DbSet<EmployeeAdministrator.Modules.TasksModule.DTOs.Task> Tasks { get; set; }

        public DbSet<Customer> Customers { get; set; }
    }
}
