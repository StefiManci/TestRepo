namespace EmployeeAdministrator.Modules.TasksModule.DTOs
{
    public class GetTaskResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public IEnumerable<Task> Tasks { get; set; }
    }
}
