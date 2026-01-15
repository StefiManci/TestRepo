namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class CreateUserResponse
    {
        public bool IsSuccess { get; set; }

        public string UserName { get; set; }

        public string Message { get; set; }
    }
}
