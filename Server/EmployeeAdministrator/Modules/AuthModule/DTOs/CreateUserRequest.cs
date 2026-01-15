namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class CreateUserRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
