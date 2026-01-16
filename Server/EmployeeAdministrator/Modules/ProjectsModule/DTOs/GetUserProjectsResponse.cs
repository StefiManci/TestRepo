namespace EmployeeAdministrator.Modules.ProjectsModule.DTOs
{
    public class GetUserProjectsResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public List<Project> Projects { get; set; } = new List<Project>();
    }
}
