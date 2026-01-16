using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs.User;

namespace EmployeeAdministrator.Modules.ProjectsModule.Domain
{
    public interface IProjectRepository
    {
        Task<CreateProjectResponse> CreateProject(CreateProjectRequest request);

        Task<EditProjectResponse> EditProject(EditProjectRequest request);

        Task<DeleteProjectResponse> DeleteProject(int projectId);

        Task<GetProjectResponse> GetProject();

        Task<AddUserToProjectResponse> AddUserToProject(string userId, int projectId);

        Task<GetProjectUsersResponse > GetProjectUsers(int projectId);

        Task<RemoveUserFromProjectResponse> RemoveUserFromProject(string userId,int projectId);
    }
}
