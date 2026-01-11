package com.talentbridge.controller;

import com.talentbridge.model.Assignment;
import com.talentbridge.model.User;
import com.talentbridge.service.AssignmentService;
import com.talentbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    // Add userService so we can look up userId when principal is username/email
    @Autowired
    private UserService userService;

    /**
     * Assign employee to a project.
     * Accepts JSON with projectId, userId (or userId as number), role.
     * Be tolerant of Number types (Integer/Long/Double) coming from JSON parser.
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignEmployee(@RequestBody Map<String, Object> request) {
        // parse projectId
        Integer projectId = null;
        Object p = request.get("projectId");
        if (p instanceof Number) projectId = ((Number) p).intValue();
        else if (p instanceof String) projectId = Integer.valueOf((String)p);

        // parse userId
        Integer userId = null;
        Object u = request.get("userId");
        if (u instanceof Number) userId = ((Number) u).intValue();
        else if (u instanceof String && !((String) u).isBlank()) userId = Integer.valueOf((String) u);

        String role = (String) request.get("role");

        if (projectId == null || userId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "projectId and userId are required and must be numbers"));
        }

        Integer assignmentId = assignmentService.assignEmployee(projectId, userId, role);
        return ResponseEntity.ok(Map.of("assignmentId", assignmentId, "message", "Employee assigned successfully"));
    }

    @PutMapping("/release/{assignmentId}")
    public ResponseEntity<?> releaseEmployee(@PathVariable Integer assignmentId) {
        assignmentService.releaseEmployee(assignmentId);
        return ResponseEntity.ok(Map.of("message", "Employee released successfully"));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Assignment>> getProjectAssignments(@PathVariable Integer projectId) {
        return ResponseEntity.ok(assignmentService.getProjectAssignments(projectId));
    }

    /**
     * Return assignments for currently authenticated user.
     * This method is robust: if Authentication.principal is Integer (userId) use it,
     * otherwise if it's a String treat it as username/email and resolve the userId via UserService.
     */
    @GetMapping("/my-assignments")
    public ResponseEntity<List<Assignment>> getMyAssignments(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }

        Object principal = authentication.getPrincipal();
        Integer userId = null;

        // If principal already an Integer (some Jwt filters set userId as principal)
        if (principal instanceof Integer) {
            userId = (Integer) principal;
        }
        // If principal is a Number
        else if (principal instanceof Number) {
            userId = ((Number) principal).intValue();
        }
        // If principal is String -> treat as username/email and lookup
        else if (principal instanceof String) {
            String username = (String) principal;
            // Try to find user by email/username
            try {
                User user = userService.getUserByEmail(username);
                if (user == null || user.getUserId() == null) {
                    return ResponseEntity.status(404).body(null);
                }
                userId = user.getUserId();
            } catch (Exception ex) {
                // If userService throws ResourceNotFoundException, return 404
                return ResponseEntity.status(404).body(null);
            }
        } else {
            // unexpected principal type
            return ResponseEntity.status(500).body(null);
        }

        return ResponseEntity.ok(assignmentService.getUserAssignments(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Assignment>> getUserAssignments(@PathVariable Integer userId) {
        return ResponseEntity.ok(assignmentService.getUserAssignments(userId));
    }

    // ALL assignments (admin use)
    @GetMapping("/all")
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }
}
