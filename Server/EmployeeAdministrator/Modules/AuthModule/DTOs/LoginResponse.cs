namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public string Token { get; set; }

        public List<string> UserRole { get; set; } = new List<string>();

        public string UserName { get; set; }

        public string UserId { get; set; }
    }
}
