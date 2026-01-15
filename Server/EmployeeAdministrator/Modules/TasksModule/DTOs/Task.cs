using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.TasksModule.DTOs
{
    public class Task
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueDate { get; set; }
        public int ProjectId { get; set; }

        public List<string> AssignedUserIds { get; set; } = new List<string>();
    }
}
