using EmployeeAdministrator.Modules.ProjectsModule.Application.Interfaces;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAdministrator.Modules.ProjectsModule.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        public IProjectService _projectService { get; }

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet("get-projects")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var response = await _projectService.GetProject();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create-project")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
        {
            try
            {
                var response = await _projectService.CreateProject(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("edit-project")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditProject([FromBody] EditProjectRequest request)
        {
            try
            {
                var response = await _projectService.EditProject(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-project/{projectId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProject(string projectId)
        {
            try
            {
                var id = Convert.ToInt16(projectId);

                var response = await _projectService.DeleteProject(id);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
