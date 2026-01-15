namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class GetUsersResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public List<UserDTO> Users { get; set; } = new List<UserDTO>();
    }
}
