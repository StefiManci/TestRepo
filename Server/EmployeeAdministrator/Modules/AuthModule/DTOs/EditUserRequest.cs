using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class EditUserRequest
    {
        [Required(ErrorMessage = "User ID is required.")]
        public string? UserId { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
        public string? UserName { get; set; }

        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$",
            ErrorMessage = "Password must contain uppercase, lowercase, number, and symbol (min 8 characters).")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@gmail\.com$", ErrorMessage = "Only Gmail addresses are allowed.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        [RegularExpression(@"^[+]?[0-9\s\-()]{7,20}$", ErrorMessage = "Phone number must be 7-20 digits and can include +, -, (), and spaces.")]
        public string? PhoneNumber { get; set; }

        [StringLength(100, ErrorMessage = "Full name can be up to 100 characters.")]
        public string? FullName { get; set; }
    }
}
