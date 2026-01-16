using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs.User;

namespace EmployeeAdministrator.Modules.ProjectsModule.Application.Interfaces
{
    public interface IProjectService
    {
        Task<CreateProjectResponse> CreateProject(CreateProjectRequest request);

        Task<EditProjectResponse> EditProject(EditProjectRequest request);

        Task<DeleteProjectResponse> DeleteProject(int projectId);

        Task<GetProjectResponse> GetProject();

        Task<AddUserToProjectResponse> AddUserToProject(string userId, int projectId);

        Task<GetProjectUsersResponse> GetProjectUsers(int projectId);

        Task<RemoveUserFromProjectResponse> RemoveUserFromProject(string userId, int projectId);

        Task<GetUserProjectsResponse> GetUserProjects(string userId);
    }
}
