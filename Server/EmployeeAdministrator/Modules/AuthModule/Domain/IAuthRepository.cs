using EmployeeAdministrator.Modules.AuthModule.DTOs;
using EmployeeAdministrator.Modules.AuthModule.DTOs.Photo_DTOs;

namespace EmployeeAdministrator.Modules.AuthModule.Domain
{
    public interface IAuthRepository
    {
        Task<GetUserProfileResponse> GetUserProfile(string userId);

        Task<GetUsersResponse> GetUsers();

        Task<EditUserResponse> EditUser(EditUserRequest request);

        Task<DeleteUserResponse> DeleteUser(string userId);
        Task<byte[]> GetUserPhoto(string userId);
        Task<string> GetUserPhotoType(string userId);

        Task<UploadPhotoResponse> UploadPhoto(string userId, IFormFile photo);
    }
}
