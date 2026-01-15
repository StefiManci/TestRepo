using Microsoft.AspNetCore.Identity;

namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class GetUserProfileResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }
        public IdentityUser User { get; set; }
        public List<string> UserRoles { get; set; }

        public Customer Customer { get; set; }

    }
}
