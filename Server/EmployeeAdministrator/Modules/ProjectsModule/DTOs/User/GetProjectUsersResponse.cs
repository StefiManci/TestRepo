namespace EmployeeAdministrator.Modules.ProjectsModule.DTOs.User
{
    public class GetProjectUsersResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public List<UserDto> Users { get; set; } = new List<UserDto>();
    }
}
