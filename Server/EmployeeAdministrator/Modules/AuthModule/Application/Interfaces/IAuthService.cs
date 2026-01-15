using EmployeeAdministrator.Modules.AuthModule.DTOs;
using EmployeeAdministrator.Modules.AuthModule.DTOs.Photo_DTOs;
using Microsoft.AspNetCore.Identity;

namespace EmployeeAdministrator.Modules.AuthModule.Application.Interfaces
{
    public interface IAuthService
    {
        public Task<string> GenerateJwtToken(IdentityUser user);

        public Task<CreateUserResponse> CreateUser(CreateUserRequest createUserRequest);

        public Task<LoginResponse> Login(LoginRequest loginRequest);

        public Task<GetUserProfileResponse> GetUserProfile(string userId);

        public Task<GetUsersResponse> GetUsers();

        public Task<EditUserResponse> EditUser(EditUserRequest request);

        public Task<DeleteUserResponse> DeleteUser(string userId);

        public Task<GetUserPhotoResponse> GetUserPhoto(string userId);

        public Task<UploadPhotoResponse> UploadPhoto(string userId, IFormFile photo); 
    }
}
