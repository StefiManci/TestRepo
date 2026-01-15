namespace EmployeeAdministrator.Modules.ProjectsModule.DTOs
{
    public class CreateProjectRequest
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime? DueDate { get; set; }

        public List<string> AssignedUserIds { get; set; } = new List<string>();

        public List<string> ProjectTasks { get; set; } = new List<string>();
    }
}
