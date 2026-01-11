package com.talentbridge.controller;

import com.talentbridge.model.EmployeeSkill;
import com.talentbridge.service.EmployeeSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-skills")
public class EmployeeSkillController {

    @Autowired
    private EmployeeSkillService employeeSkillService;

    @GetMapping
    public ResponseEntity<List<EmployeeSkill>> getAllEmployeeSkills() {
        return ResponseEntity.ok(employeeSkillService.getAllEmployeeSkills());
    }

    @GetMapping("/my-skills")
    public ResponseEntity<List<EmployeeSkill>> getMySkills(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        return ResponseEntity.ok(employeeSkillService.getEmployeeSkills(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EmployeeSkill>> getUserSkills(@PathVariable Integer userId) {
        return ResponseEntity.ok(employeeSkillService.getEmployeeSkills(userId));
    }

    @PostMapping
    public ResponseEntity<?> addSkill(@RequestBody EmployeeSkill employeeSkill,
                                      Authentication authentication) {

        Integer loggedInUserId = (Integer) authentication.getPrincipal();

        // Extract role from Spring Security authorities
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        // EMPLOYEE → can only add skill to themselves
        if (role.equals("EMPLOYEE")) {
            employeeSkill.setUserId(loggedInUserId);
        }

        // ADMIN/HR → must provide userId in payload
        if (role.equals("ADMIN") || role.equals("HR")) {
            if (employeeSkill.getUserId() == null) {
                throw new RuntimeException("Admin/HR must provide userId in request body.");
            }
        }

        Integer id = employeeSkillService.addEmployeeSkill(employeeSkill);

        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Skill added successfully"
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(@PathVariable Integer id,
                                         @RequestBody EmployeeSkill employeeSkill) {

        employeeSkill.setId(id);
        employeeSkillService.updateEmployeeSkill(employeeSkill);

        return ResponseEntity.ok(Map.of("message", "Skill updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Integer id) {
        employeeSkillService.deleteEmployeeSkill(id);
        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }
}
