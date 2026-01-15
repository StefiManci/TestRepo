namespace EmployeeAdministrator.Modules.ProjectsModule.DTOs
{
    public class GetProjectResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public IEnumerable<Project> Projects { get; set; }
    }
}
