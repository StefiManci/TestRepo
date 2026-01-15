using Microsoft.AspNetCore.Identity;

namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class UserDTO
    {
        public IdentityUser User { get; set; }

        public List<string> UserRoles { get; set; }  = new List<string>();
    }
}
