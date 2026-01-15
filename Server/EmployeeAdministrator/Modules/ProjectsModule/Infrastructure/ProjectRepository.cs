using EmployeeAdministrator.DataLayer;
using EmployeeAdministrator.Modules.ProjectsModule.Domain;
using EmployeeAdministrator.Modules.ProjectsModule.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAdministrator.Modules.ProjectsModule.Infrastructure
{
    public class ProjectRepository : IProjectRepository
    {
        public ApplicationDbContext _dbContext;

        public ProjectRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreateProjectResponse> CreateProject(CreateProjectRequest request)
        {
            try
            {
                var newProject = new Project
                {
                    Name = request.Name,
                    Description = request.Description,
                    IsCompleted = request.IsCompleted,
                    CreatedAt = DateTime.UtcNow,
                    DueDate = request.DueDate,
                    AssignedUserIds = request.AssignedUserIds ?? new List<string>(),
                    ProjectTasks = request.ProjectTasks ?? new List<string>(),
                };

                _dbContext.Projects.Add(newProject);
                
                await _dbContext.SaveChangesAsync();

                return new CreateProjectResponse
                {
                    Success = true,
                    Message = "Project Created Successfully!"
                };
            }catch(Exception ex)
            {
                return new CreateProjectResponse
                {
                    Success = false,
                    Message = "Repository Error :" + ex.Message,
                };
            }
        }

        public async Task<DeleteProjectResponse> DeleteProject(int projectId)
        {
            try
            {
                var projectToBeDeleted = await _dbContext.Projects.FirstOrDefaultAsync(p => p.Id == projectId);

                if(projectToBeDeleted != null)
                {
                   _dbContext.Projects.Remove(projectToBeDeleted);
                    await _dbContext.SaveChangesAsync();

                    return new DeleteProjectResponse { Success = true , Message ="Project Deleted!"};
                }

                return new DeleteProjectResponse
                {
                    Success = false,
                    Message = "Project was not found!"
                };

            }catch(Exception ex)
            {
                return new DeleteProjectResponse
                {
                    Success = false,
                    Message = "Repository Error: " + ex.Message,
                };
            }
        }

        public async Task<EditProjectResponse> EditProject(EditProjectRequest request)
        {
            try
            {
                var existingProject = await _dbContext.Projects.FirstOrDefaultAsync(p=>p.Id==request.Id);

                if(existingProject == null)
                {
                    return new EditProjectResponse
                    {
                        Success = false,
                        Message = "Project with the provided ID doesn`t exist"
                    };
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    existingProject.Name = request.Name;
                }
                if (!string.IsNullOrWhiteSpace(request.Description))
                {
                    existingProject.Description = request.Description;
                }

                existingProject.IsCompleted = request.IsCompleted;
                existingProject.DueDate = request.DueDate;
                existingProject.AssignedUserIds = request.AssignedUserIds;
                existingProject.ProjectTasks = request.ProjectTasks;

                await _dbContext.SaveChangesAsync();

                return new EditProjectResponse
                {
                    Success = true,
                    Message = "Project Updated!"
                };

            }catch(Exception ex)
            {
                return new EditProjectResponse
                {
                    Success = false,
                    Message = "Database level error: " + ex.Message,
                };
            }
        }

        public async Task<GetProjectResponse> GetProject()
        {
            try
            {
                var projects =await _dbContext.Projects.ToListAsync();

                if (projects.Any())
                {
                    return new GetProjectResponse
                    {
                        Success = true,
                        Message = "Projects Returned",
                        Projects = projects
                    };
                }

                return new GetProjectResponse
                {
                    Success = false,
                    Message = "No Projects Found"
                };

            }catch(Exception e)
            {
                return new GetProjectResponse
                {
                    Success = false,
                    Message = "Repository Error: " + e.Message,
                };
            }
        }
    }
}
