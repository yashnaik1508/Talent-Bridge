package com.talentbridge.controller;

import com.talentbridge.model.Task;
import com.talentbridge.model.User;
import com.talentbridge.service.TaskService;
import com.talentbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER')")
    public ResponseEntity<Task> createTask(@RequestBody Task task, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        task.setCreatedBy(currentUserId);
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Task>> getTeamTasks(@PathVariable Integer teamId) {
        return ResponseEntity.ok(taskService.getTasksByTeam(teamId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        return ResponseEntity.ok(taskService.getMyTasks(currentUserId));
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateTaskStatus(@RequestBody Map<String, Object> body, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        Integer taskId = ((Number) body.get("taskId")).intValue();
        String status = (String) body.get("status");
        String completedWork = (String) body.get("completedWork");
        String pendingWork = (String) body.get("pendingWork");

        taskService.updateTaskStatus(taskId, status, completedWork, pendingWork, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Task status updated successfully"));
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER')")
    public ResponseEntity<?> deleteTask(@PathVariable Integer taskId, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        taskService.deleteTask(taskId, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    private Integer resolveUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof Integer) return (Integer) principal;
        if (principal instanceof Number) return ((Number) principal).intValue();
        if (principal instanceof String) {
            try {
                User user = userService.getUserByEmail((String) principal);
                return user != null ? user.getUserId() : null;
            } catch (Exception e) { return null; }
        }
        return null;
    }
}
