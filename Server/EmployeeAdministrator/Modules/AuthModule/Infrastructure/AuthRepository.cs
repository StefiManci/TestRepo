using EmployeeAdministrator.DataLayer;
using EmployeeAdministrator.Migrations;
using EmployeeAdministrator.Modules.AuthModule.Domain;
using EmployeeAdministrator.Modules.AuthModule.DTOs;
using EmployeeAdministrator.Modules.AuthModule.DTOs.Photo_DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Customer = EmployeeAdministrator.Modules.AuthModule.DTOs.Customer;

namespace EmployeeAdministrator.Modules.AuthModule.Infrastructure
{
    public class AuthRepository : IAuthRepository
    {
        public ApplicationDbContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;
        public AuthRepository(ApplicationDbContext dbContext , UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<GetUserProfileResponse> GetUserProfile(string userId)
        {
            try
            {
                
                var user = await _userManager.FindByIdAsync(userId);

                var customer = await _dbContext.Customers.FirstOrDefaultAsync(c=>c.UserId == userId);

                if (user != null && customer != null)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    var response = new GetUserProfileResponse
                    {
                        Success = true,
                        Message = "User Profile Returned Successfully!",
                        User = user,
                        UserRoles = (List<string>)roles ?? new List<string>(),
                        Customer = customer
                    };

                    return response;
                }

                return new GetUserProfileResponse
                {
                    Success = false,
                    Message = "User Profile Was Not Found"
                };

            }catch (Exception ex)
            {
                return new GetUserProfileResponse
                {
                    Success = false,
                    Message ="Repository Error :"+ ex.Message,
                };
            }
        }

        public async Task<GetUsersResponse> GetUsers()
        {
            try
            {
                var userList = new List<UserDTO>();

                var users = await _dbContext.Users.ToListAsync();


                if (users.Any())
                {
                    foreach (var user in users)
                    {
                        var userRoles = await _userManager.GetRolesAsync(user);

                        var customerData = await _dbContext.Customers.FirstOrDefaultAsync(c=>c.UserId == user.Id);

                        var singleUser = new UserDTO
                        {
                            User = user,
                            UserRoles = (List<string>)userRoles,
                            Customer = customerData
                        };

                        userList.Add(singleUser);
                    }

                    return new GetUsersResponse
                    {
                        Success = true,
                        Message = "User List Returned Successfully",
                        Users = userList
                    };
                }

                return new GetUsersResponse
                {
                    Success = false,
                    Message = "No Users Were Found!"
                };

            }catch ( Exception ex)
            {
                return new GetUsersResponse
                {
                    Success = false,
                    Message = "Repository Error!" + ex.Message,
                };
            }
        }

        public async Task<EditUserResponse> EditUser(EditUserRequest request)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(request.UserId);
                if (user == null)
                {
                    return new EditUserResponse
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }
                if (!string.IsNullOrEmpty(request.UserName))
                    user.UserName = request.UserName;

                if (!string.IsNullOrEmpty(request.Email))
                    user.Email = request.Email;

                if (!string.IsNullOrEmpty(request.PhoneNumber))
                    user.PhoneNumber = request.PhoneNumber;

                if (!string.IsNullOrEmpty(request.Password))
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var result = await _userManager.ResetPasswordAsync(user, token, request.Password);
                    if (!result.Succeeded)
                    {
                        return new EditUserResponse
                        {
                            Success = false,
                            Message = "Failed to update password: " + string.Join(", ", result.Errors.Select(e => e.Description))
                        };
                    }
                }
                var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.UserId == request.UserId);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        UserId = request.UserId,
                        FullName = request.FullName ?? user.UserName
                    };

                    _dbContext.Customers.Add(customer);
                }
                else
                {
     
                    customer.FullName = request.FullName ?? customer.FullName;

                }

                await _dbContext.SaveChangesAsync();
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return new EditUserResponse
                    {
                        Success = false,
                        Message = "Failed to update user: " + string.Join(", ", updateResult.Errors.Select(e => e.Description))
                    };
                }

                return new EditUserResponse
                {
                    Success = true,
                    Message = "User updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new EditUserResponse
                {
                    Success = false,
                    Message = "Repository Error: " + ex.Message
                };
            }
        }

        public async Task<DeleteUserResponse> DeleteUser(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user != null)
                {
                    var deletionResult = await _userManager.DeleteAsync(user);

                    if (!deletionResult.Succeeded)
                    {
                        return new DeleteUserResponse
                        {
                            Success = false,
                            Message = "Cannot Delete User: " + deletionResult.Errors.ToString(),
                        };
                    }

                    return new DeleteUserResponse
                    {
                        Success = true,
                        Message = "User Deleted Successfully!"
                    };
                }

                return new DeleteUserResponse
                {
                    Success = false,
                    Message = "User Was Not Found!"
                };

            }
            catch ( Exception ex )
            {
                return new DeleteUserResponse
                {
                    Success = false,
                    Message = "Repository Error : "+ ex.Message,
                };
            }
        }

        public async Task<byte[]> GetUserPhoto(string userId)
        {
            var user = await _dbContext.Customers.FirstOrDefaultAsync(x => x.UserId == userId);
            return user?.Photo;
        }

        public async Task<string> GetUserPhotoType(string userId)
        {
            var user = await _dbContext.Customers.FirstOrDefaultAsync(x => x.UserId == userId);
            return user?.PhotoContentType;
        }

        public async Task<UploadPhotoResponse> UploadPhoto(string userId, IFormFile photo)
        {
            if (photo == null || photo.Length == 0)
            {
                return new UploadPhotoResponse
                {
                    Success = false,
                    Message = "No file was provided!"
                };
            }

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };

            if (!allowedTypes.Contains(photo.ContentType))
            {
                return new UploadPhotoResponse
                {
                    Success = false,
                    Message = "Invalid file type!"
                };
            }

            if (photo.Length > 2 * 1024 * 1024)
            {
                return new UploadPhotoResponse
                {
                    Success = false,
                    Message = "File too large!"
                };
            }

            var customer = await _dbContext.Customers.FirstOrDefaultAsync();
            using var ms = new MemoryStream();

            if (customer == null)
            {
                await photo.CopyToAsync(ms);

                var newCustomer = new Customer
                {
                    UserId = userId,
                    Photo = ms.ToArray(),
                    PhotoContentType = photo.ContentType
                };

                await _dbContext.SaveChangesAsync();

                return new UploadPhotoResponse
                {
                    Success = true,
                    Message = "Photo Uploaded Successgully!"
                };
            }
            await photo.CopyToAsync(ms);

            customer.Photo = ms.ToArray();
            customer.PhotoContentType = photo.ContentType;

            await _dbContext.SaveChangesAsync();

            return new UploadPhotoResponse
            {
                Success = true,
                Message = "Photo Uploaded Successgully!"
            };

        }
    }
}
