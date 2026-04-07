package com.talentbridge.controller;

import com.talentbridge.model.Team;
import com.talentbridge.model.TeamMember;
import com.talentbridge.model.TeamMessage;
import com.talentbridge.model.User;
import com.talentbridge.service.TeamService;
import com.talentbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER')")
    public ResponseEntity<Team> createTeam(@RequestBody Team team, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        team.setCreatedBy(currentUserId);
        Team created = teamService.createTeam(team);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Team>> getTeams(Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        List<Team> teams = teamService.getTeamsForUser(currentUserId);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<Team> getTeam(@PathVariable Integer teamId, Authentication auth) {
        return ResponseEntity.ok(teamService.getTeamById(teamId));
    }

    @DeleteMapping("/{teamId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER')")
    public ResponseEntity<?> deleteTeam(@PathVariable Integer teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.ok(Map.of("message", "Team deleted successfully"));
    }

    // Members endpoints
    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMember>> getMembers(@PathVariable Integer teamId, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        return ResponseEntity.ok(teamService.getTeamMembers(teamId, currentUserId));
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER', 'HR')")
    public ResponseEntity<?> addMember(@PathVariable Integer teamId, @RequestBody Map<String, Object> body, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        Integer userId = ((Number) body.get("userId")).intValue();
        String role = (String) body.getOrDefault("role", "MEMBER");
        
        teamService.addMember(teamId, userId, role, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Member added"));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PM', 'PROJECT_MANAGER', 'HR')")
    public ResponseEntity<?> removeMember(@PathVariable Integer teamId, @PathVariable Integer userId, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        teamService.removeMember(teamId, userId, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Member removed"));
    }

    // Messages endpoints
    @GetMapping("/{teamId}/messages")
    public ResponseEntity<List<TeamMessage>> getMessages(@PathVariable Integer teamId, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        return ResponseEntity.ok(teamService.getTeamMessages(teamId, currentUserId));
    }

    @PostMapping("/{teamId}/messages")
    public ResponseEntity<TeamMessage> postMessage(@PathVariable Integer teamId, @RequestBody Map<String, String> body, Authentication auth) {
        Integer currentUserId = resolveUserId(auth);
        String text = body.get("message");
        TeamMessage message = teamService.postMessage(teamId, currentUserId, text);
        return ResponseEntity.ok(message);
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
