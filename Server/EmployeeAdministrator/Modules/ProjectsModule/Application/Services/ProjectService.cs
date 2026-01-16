using EmployeeAdministrator.DataLayer;
using EmployeeAdministrator.Modules.ProjectsModule.Application.Interfaces;
using EmployeeAdministrator.Modules.ProjectsModule.Domain;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs.User;

namespace EmployeeAdministrator.Modules.ProjectsModule.Application.Services
{
    public class ProjectService : IProjectService
    {
        public IProjectRepository _projectRepository { get; }

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<CreateProjectResponse> CreateProject(CreateProjectRequest request)
        {
            try
            {
                return await _projectRepository.CreateProject(request);
            }
            catch (Exception ex) {
                return new CreateProjectResponse
                {
                    Success = false,
                    Message = "Service Level Error:" + ex.Message
                };
            }
        }

        public async Task<EditProjectResponse> EditProject(EditProjectRequest request)
        {
            try
            {
                return await _projectRepository.EditProject(request);
            }
            catch (Exception ex)
            {
                return new EditProjectResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<DeleteProjectResponse> DeleteProject(int projectId)
        {
            try
            {
                return await _projectRepository.DeleteProject(projectId);
            }
            catch (Exception ex)
            {
                return new DeleteProjectResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<GetProjectResponse> GetProject()
        {
            try
            {
                return await _projectRepository.GetProject();
            }
            catch (Exception ex)
            {
                return new GetProjectResponse
                {
                    Success = false,
                    Message = "Service Error :"+ ex.Message
                };
            }
        }

        public async Task<AddUserToProjectResponse> AddUserToProject(string userId, int projectId)
        {
           return await _projectRepository.AddUserToProject(userId, projectId);
        }

        public async Task<GetProjectUsersResponse> GetProjectUsers(int projectId)
        {
            return await _projectRepository.GetProjectUsers(projectId);
        }

        public async Task<RemoveUserFromProjectResponse> RemoveUserFromProject(string userId, int projectId)
        {
            return await _projectRepository.RemoveUserFromProject(userId, projectId);   
        }
    }
}
