using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.TasksModule.DTOs
{
    public class CreateTaskRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters.")]
        public string Description { get; set; }
        public bool IsCompleted { get; set; } = false;

        [Required(ErrorMessage = "DueDate is required.")]
        [DataType(DataType.Date)]
        public DateTime? DueDate { get; set; }

        [Required(ErrorMessage = "ProjectId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a positive integer.")]
        public int ProjectId { get; set; }

        public List<string> AssignedUserIds { get; set; } = new List<string>();
    }
}
