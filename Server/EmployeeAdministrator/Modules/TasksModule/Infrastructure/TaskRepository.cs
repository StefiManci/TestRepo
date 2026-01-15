using EmployeeAdministrator.DataLayer;
using EmployeeAdministrator.Modules.TasksModule.Domain;
using EmployeeAdministrator.Modules.TasksModule.DTOs;
using Microsoft.EntityFrameworkCore;
using Task = EmployeeAdministrator.Modules.TasksModule.DTOs.Task;

namespace EmployeeAdministrator.Modules.TasksModule.Infrastructure
{
    public class TaskRepository : ITaskRepository
    {
        public ApplicationDbContext _dbContext;

        public TaskRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreateTaskResponse> CreateTask(CreateTaskRequest request)
        {
            try
            {
                var newTask = new Task()
                {
                    Title = request.Title,
                    Description = request.Description,
                    IsCompleted = request.IsCompleted,
                    CreatedAt = DateTime.UtcNow,
                    DueDate = request.DueDate,
                    ProjectId = request.ProjectId,
                    AssignedUserIds = request.AssignedUserIds,
                };

                _dbContext.Tasks.Add(newTask);
                await _dbContext.SaveChangesAsync();

                return new CreateTaskResponse
                {
                    Success = true,
                    Message = "Task Created Successfully"
                };
            }
            catch (Exception ex) {
                return new CreateTaskResponse
                {
                    Success = false,
                    Message = "Repository Error :" + ex.Message,
                };
            }
        }

        public async Task<DeleteTaskResponse> DeleteTask(int taskId)
        {
            try
            {
                var taskToBeDeleted = await _dbContext.Tasks.FirstOrDefaultAsync(p=>p.Id == taskId);

                if (taskToBeDeleted != null)
                {
                    _dbContext.Tasks.Remove(taskToBeDeleted);
                    await _dbContext.SaveChangesAsync();

                    return new DeleteTaskResponse
                    {
                        Success = true,
                        Message = "Task Deleted!"
                    };
                }

                return new DeleteTaskResponse
                {
                    Success = false,
                    Message = "Task Was Not Found!"
                };

            }
            catch (Exception ex)
            {
                return new DeleteTaskResponse
                {
                    Success = false,
                    Message = "Repository Error :" + ex.Message
                };
            }
        }

        public async Task<EditTaskResponse> EditTask(EditTaskRequest request)
        {
            try
            {
                var existingTask =await _dbContext.Tasks.FirstOrDefaultAsync(p=>p.Id == request.Id);

                if(existingTask != null)
                {
                    existingTask.Title = request.Title;
                    existingTask.Description = request.Description;
                    existingTask.IsCompleted = request.IsCompleted;
                    existingTask.DueDate = request.DueDate;
                    existingTask.ProjectId = request.ProjectId;
                    existingTask.AssignedUserIds = request.AssignedUserIds;

                    await _dbContext.SaveChangesAsync();

                    return new EditTaskResponse
                    {
                        Success = true,
                        Message = "Task Edited"
                    };
                }

                return new EditTaskResponse
                {
                    Success = false,
                    Message = "Task Was Not Found!"
                };

            }
            catch (Exception ex)
            {
                return new EditTaskResponse
                {
                    Success = false,
                    Message = "Repository Error : "+ex.Message
                };
            }
        }

        public async Task<GetTaskResponse> GetTask()
        {
            try
            {
                var tasks = await _dbContext.Tasks.ToListAsync();

                if (tasks.Any())
                {
                    return new GetTaskResponse
                    {
                        Success = true,
                        Message = "Tasks Returned!",
                        Tasks = tasks
                    };
                }
                return new GetTaskResponse
                {
                    Success = false,
                    Message = "No Tasks Were Found!",
                };

            }
            catch (Exception ex)
            {
                return new GetTaskResponse
                {
                    Success = false,
                    Message = "Repository Error : "+ex.Message
                };
            }
        }
    }
}
