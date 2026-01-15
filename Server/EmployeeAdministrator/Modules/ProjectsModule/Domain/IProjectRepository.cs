using EmployeeAdministrator.Modules.ProjectsModule.DTOs;

namespace EmployeeAdministrator.Modules.ProjectsModule.Domain
{
    public interface IProjectRepository
    {
        Task<CreateProjectResponse> CreateProject(CreateProjectRequest request);

        Task<EditProjectResponse> EditProject(EditProjectRequest request);

        Task<DeleteProjectResponse> DeleteProject(int projectId);

        Task<GetProjectResponse> GetProject();
    }
}
