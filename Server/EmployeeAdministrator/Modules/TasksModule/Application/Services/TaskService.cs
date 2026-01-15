using EmployeeAdministrator.Modules.TasksModule.Application.Interfaces;
using EmployeeAdministrator.Modules.TasksModule.Domain;
using EmployeeAdministrator.Modules.TasksModule.DTOs;

namespace EmployeeAdministrator.Modules.TasksModule.Application.Services
{
    public class TaskService : ITaskService
    {
        public ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<CreateTaskResponse> CreateTask(CreateTaskRequest request)
        {
            try
            {
                return await _taskRepository.CreateTask(request);
            }
            catch (Exception ex)
            {
                return new CreateTaskResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<DeleteTaskResponse> DeleteTask(int taskID)
        {
            try
            {
                return await _taskRepository.DeleteTask(taskID);
            }
            catch (Exception ex)
            {
                return new DeleteTaskResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<EditTaskResponse> EditTask(EditTaskRequest request)
        {
            try
            {
                return await _taskRepository.EditTask(request);
            }
            catch (Exception ex)
            {
                return new EditTaskResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }

        public async Task<GetTaskResponse> GetTask()
        {
            try
            {
                return await _taskRepository.GetTask();
            }
            catch (Exception ex)
            {
                return new GetTaskResponse
                {
                    Success = false,
                    Message = "Service Error :" + ex.Message
                };
            }
        }
    }
}
