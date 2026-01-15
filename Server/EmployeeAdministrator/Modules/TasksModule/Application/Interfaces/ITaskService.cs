using EmployeeAdministrator.Modules.TasksModule.DTOs;

namespace EmployeeAdministrator.Modules.TasksModule.Application.Interfaces
{
    public interface ITaskService
    {
        Task<CreateTaskResponse> CreateTask(CreateTaskRequest request);

        Task<EditTaskResponse> EditTask(EditTaskRequest request);

        Task<DeleteTaskResponse> DeleteTask(int taskId);

        Task<GetTaskResponse> GetTask();
    }
}
