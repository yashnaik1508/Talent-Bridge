package com.talentbridge.service;

import com.talentbridge.model.Task;
import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    List<Task> getTasksByTeam(Integer teamId);
    List<Task> getMyTasks(Integer userId);
    void updateTaskStatus(Integer taskId, String status, String completedWork, String pendingWork, Integer userId);
    void deleteTask(Integer taskId, Integer userId);
}
