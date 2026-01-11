package com.talentbridge.controller;

import com.talentbridge.model.Project;
import com.talentbridge.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.getAllProjects(page, size));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(projectService.getProjectsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project, Authentication authentication) {
        // SAFE extraction of user id from authentication principal.
        Integer userId = null;
        if (authentication != null && authentication.getPrincipal() != null) {
            Object principal = authentication.getPrincipal();
            // Many apps use a custom principal or UserDetails; only set createdBy if it's an Integer
            if (principal instanceof Integer) {
                userId = (Integer) principal;
            } else {
                // attempt to parse a numeric name (if your auth stores user id as principal name)
                try {
                    String name = principal.toString();
                    if (name != null && name.matches("\\d+")) {
                        userId = Integer.parseInt(name);
                    }
                } catch (Exception ignored) {
                }
            }
        }
        // If userId is still null, we leave createdBy unset (backend DB may allow null or have default)
        if (userId != null) {
            project.setCreatedBy(userId);
        }

        Integer projectId = projectService.createProject(project);
        return ResponseEntity.ok(Map.of("projectId", projectId, "message", "Project created successfully"));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Integer projectId, @RequestBody Project project) {
        project.setProjectId(projectId);
        projectService.updateProject(project);
        return ResponseEntity.ok(Map.of("message", "Project updated successfully"));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }
}
