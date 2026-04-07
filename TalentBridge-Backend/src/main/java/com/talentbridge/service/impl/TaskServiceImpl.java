package com.talentbridge.service.impl;

import com.talentbridge.dao.TaskDao;
import com.talentbridge.dao.UserDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.Task;
import com.talentbridge.model.User;
import com.talentbridge.service.NotificationService;
import com.talentbridge.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskDao taskDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public Task createTask(Task task) {
        // Validate creator is Admin or PM
        User creator = userDao.findById(task.getCreatedBy());
        if (creator == null || (!"ADMIN".equals(creator.getRole()) && !"PM".equals(creator.getRole()) && !"PROJECT_MANAGER".equals(creator.getRole()))) {
            throw new CustomException("Access Denied: Only Admins or PMs can create tasks", "403");
        }

        // Validate assigned user exists
        User assignee = userDao.findById(task.getAssignedTo());
        if (assignee == null) {
            throw new ResourceNotFoundException("Assigned employee not found");
        }

        Integer taskId = taskDao.save(task);
        
        notificationService.createNotification(task.getAssignedTo(), 
            "New task assigned: " + task.getTitle(), "TASK_ASSIGNMENT");
            
        return taskDao.findById(taskId);
    }

    @Override
    public List<Task> getTasksByTeam(Integer teamId) {
        return taskDao.findByTeamId(teamId);
    }

    @Override
    public List<Task> getMyTasks(Integer userId) {
        return taskDao.findByAssignedTo(userId);
    }

    @Override
    @Transactional
    public void updateTaskStatus(Integer taskId, String status, String completedWork, String pendingWork, Integer userId) {
        Task task = taskDao.findById(taskId);
        if (task == null) throw new ResourceNotFoundException("Task not found");

        User user = userDao.findById(userId);
        
        // Only assignee, PM or Admin can update
        boolean isAssignee = task.getAssignedTo().equals(userId);
        boolean isAdminOrPM = "ADMIN".equals(user.getRole()) || "PM".equals(user.getRole()) || "PROJECT_MANAGER".equals(user.getRole());
        
        if (!isAssignee && !isAdminOrPM) {
            throw new CustomException("Access Denied: You cannot update this task", "403");
        }

        taskDao.updateStatus(taskId, status, completedWork, pendingWork);
        
        if (isAssignee && !isAdminOrPM) {
             notificationService.createNotification(task.getCreatedBy(), 
                "Task updated by " + user.getFullName() + ": " + task.getTitle(), "TASK_UPDATE");
        }
    }

    @Override
    public void deleteTask(Integer taskId, Integer userId) {
        Task task = taskDao.findById(taskId);
        if (task == null) throw new ResourceNotFoundException("Task not found");

        User user = userDao.findById(userId);
        if (!"ADMIN".equals(user.getRole()) && !"PM".equals(user.getRole()) && !"PROJECT_MANAGER".equals(user.getRole())) {
            throw new CustomException("Access Denied: Only Admins or PMs can delete tasks", "403");
        }
        
        taskDao.delete(taskId);
    }
}
