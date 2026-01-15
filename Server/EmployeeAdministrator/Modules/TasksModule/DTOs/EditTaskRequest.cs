namespace EmployeeAdministrator.Modules.TasksModule.DTOs
{
    public class EditTaskRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime? DueDate { get; set; }
        public int ProjectId { get; set; }

        public List<string> AssignedUserIds { get; set; } = new List<string>();
    }
}
