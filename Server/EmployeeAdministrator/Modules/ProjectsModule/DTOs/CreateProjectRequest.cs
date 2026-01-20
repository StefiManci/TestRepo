using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.ProjectsModule.DTOs
{
    public class CreateProjectRequest
    {
        [Required(ErrorMessage = "Project name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Project name must be between 3 and 100 characters.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        [DataType(DataType.Date)]
        [FutureDate(ErrorMessage = "Due date must be in the future.")]
        public DateTime? DueDate { get; set; }

        [MinLength(1, ErrorMessage = "At least one user must be assigned to the project.")]
        public List<string> AssignedUserIds { get; set; } = new();

        [MinLength(1, ErrorMessage = "Project must contain at least one task.")]
        public List<string> ProjectTasks { get; set; } = new();
    }
    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null) return true;

            if (value is DateTime date)
            {
                return date.Date > DateTime.UtcNow.Date;
            }

            return false;
        }
    }
}
