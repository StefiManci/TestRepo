namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class GetUserPhotoResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public byte[] Photo { get; set; }

        public string PhotoType { get; set; }

    }
}
