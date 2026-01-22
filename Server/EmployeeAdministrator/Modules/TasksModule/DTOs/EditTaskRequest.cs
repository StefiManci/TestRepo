using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.TasksModule.DTOs
{
    public class EditTaskRequest
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        [Required(ErrorMessage = "Due date is required")]
        [DataType(DataType.Date)]
        public DateTime? DueDate { get; set; }

        [Required(ErrorMessage = "ProjectId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a valid positive number")]
        public int ProjectId { get; set; }

        public List<string> AssignedUserIds { get; set; } = new List<string>();
    }
}
