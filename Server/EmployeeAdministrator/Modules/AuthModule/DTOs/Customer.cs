using System.ComponentModel.DataAnnotations;

namespace EmployeeAdministrator.Modules.AuthModule.DTOs
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }

        public byte[]? Photo { get; set; }
        public string? PhotoContentType { get; set; }
    }
}
