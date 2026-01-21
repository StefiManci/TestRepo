using EmployeeAdministrator.Modules.AuthModule.Application.Interfaces;
using EmployeeAdministrator.Modules.AuthModule.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAdministrator.Modules.AuthModule.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAuthService _authService;

        public AuthController(UserManager<IdentityUser> userManager, IAuthService authService)
        {
            _userManager = userManager;
            _authService = authService;
        }


        [HttpPost("create-user")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> CreateUser(CreateUserRequest createUserRequest)
        {
            try
            {
                var response = await _authService.CreateUser(createUserRequest);

                return Ok(response);

            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            try
            {
                var response = await _authService.Login(loginRequest);

                return Ok(response);

            } catch (Exception ex)
            {
                return BadRequest($"Failed to login {ex.Message}");
            }
        }

        [HttpGet("get-user-profile/{userId}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            try
            {
                var response = await _authService.GetUserProfile(userId);

                return Ok(response);

            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var response = await _authService.GetUsers();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("edit-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditUser(EditUserRequest editUserRequest)
        {
            try
            {
                var response = await _authService.EditUser(editUserRequest);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("edit-user-employee")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> EditUserEmployee(EditUserEmployeeRequest editUserRequest)
        {
            try
            {
                var request = new EditUserRequest
                {
                    UserId = editUserRequest.UserId,
                    UserName = editUserRequest?.UserName,
                    Password = editUserRequest?.Password,
                    Email = editUserRequest?.Email,
                    PhoneNumber = editUserRequest?.PhoneNumber,
                    FullName = editUserRequest?.FullName,
                };

                var response = await _authService.EditUser(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var response = await _authService.DeleteUser(userId);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("users/{id}/photo")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetUserPhoto(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var response = await _authService.GetUserPhoto(id);

            return Ok(response);
        }


        [HttpPost("uploadPhoto/{userId}")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> UploadPhoto(string userId, IFormFile photo)
        {
          if (!ModelState.IsValid || photo == null)
            {
                return BadRequest("No file was uploaded!");
            }

          var response = await _authService.UploadPhoto(userId, photo);

          return Ok(response);
        }

    }
}
