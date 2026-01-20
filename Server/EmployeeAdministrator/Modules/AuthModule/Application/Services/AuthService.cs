using EmployeeAdministrator.Modules.AuthModule.Application.Interfaces;
using EmployeeAdministrator.Modules.AuthModule.Domain;
using EmployeeAdministrator.Modules.AuthModule.DTOs;
using EmployeeAdministrator.Modules.AuthModule.DTOs.Photo_DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeAdministrator.Modules.AuthModule.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthRepository _authRepository;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AuthService(IConfiguration configuration, IAuthRepository authRepository,UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<CreateUserResponse> CreateUser(CreateUserRequest createUserRequest)
        {
            try
            {
                var newUser = new IdentityUser
                {
                    UserName = createUserRequest.UserName,
                    Email = createUserRequest.Email,
                    PhoneNumber = createUserRequest.PhoneNumber,
                };

                var result = await _userManager.CreateAsync(newUser, createUserRequest.Password);

                if(!result.Succeeded)
                {
                    return new CreateUserResponse
                    {
                        IsSuccess = false,
                        Message = "Failed To Create User!"
                    };
                }

                if (await _roleManager.RoleExistsAsync("Employee"))
                {

                    var roleResult =await _userManager.AddToRoleAsync(newUser, "Employee");

                    if(!roleResult.Succeeded)
                    {
                        return new CreateUserResponse
                        {
                            IsSuccess = false,
                            Message = "Failed To Add Role To The User!"
                        };
                    }
                    
                    
                }
                else
                {
                    return new CreateUserResponse
                    {
                        IsSuccess = false,
                        Message = "Employee Role Doesnt Exist!"
                    };
                }


                return new CreateUserResponse
                {
                    IsSuccess = true,
                    Message = "User Was Created Successfully!"
                };

            }catch (Exception ex)
            {
                return new CreateUserResponse
                {
                    IsSuccess = false,
                    Message = "Unexpected Error : " + ex.Message
                };
            }
        }

        public async Task<DeleteUserResponse> DeleteUser(string userId)
        {
            try
            {
                var response = await _authRepository.DeleteUser(userId);

                return response;

            }catch (Exception ex)
            {
                return new DeleteUserResponse();
            }
        }

        public async Task<EditUserResponse> EditUser(EditUserRequest request)
        {
            try
            {
                var response = await _authRepository.EditUser(request);

                return response;

            }
            catch (Exception ex)
            {
                return new EditUserResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<string> GenerateJwtToken(IdentityUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

 
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName)
    };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<GetUserProfileResponse> GetUserProfile(string userId)
        {
            try
            {
                var response = await _authRepository.GetUserProfile(userId);

                return response;
            }
            catch (Exception ex)
            {
                return new GetUserProfileResponse();
            }
        }

        public async Task<GetUsersResponse> GetUsers()
        {
            try
            {
                var response = await _authRepository.GetUsers();

                return response;
            }
            catch (Exception ex)
            {
                return new GetUsersResponse();
            }
        }

        public async Task<LoginResponse> Login(LoginRequest loginRequest)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(loginRequest.Email);

                if(user == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "User Email or Password Incorrect!"
                    };
                }

                if(!await _userManager.CheckPasswordAsync(user, loginRequest.Password))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "User Email or Password Incorrect!"
                    };
                }

                var  token = await GenerateJwtToken(user);

                var userDetails =await GetUserProfile(user.Id);



                return new LoginResponse
                {
                    Success = true,
                    Message = "Login Successful",
                    Token = token,
                    UserRole = userDetails.UserRoles,
                    UserName = user.UserName,
                    UserId = user.Id
                };



            }catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = ex.ToString()
                };
            }
        }

        public async Task<GetUserPhotoResponse> GetUserPhoto(string userId)
        {
            var photo = await _authRepository.GetUserPhoto(userId);
            var photoType = await _authRepository.GetUserPhotoType(userId);

            if(photoType != null && photo != null)
            {
                return new GetUserPhotoResponse
                {
                    Success = true,
                    Message = "Photo Returned Successfully!",
                    Photo = photo,
                    PhotoType = photoType
                };
            }

            return new GetUserPhotoResponse
            {
                Success = false,
                Message = "This User Has No Photo Saved !",
            };
        }

        public  async Task<UploadPhotoResponse> UploadPhoto(string userId, IFormFile photo)
        {
            return await _authRepository.UploadPhoto(userId, photo);
        }
    }
}
