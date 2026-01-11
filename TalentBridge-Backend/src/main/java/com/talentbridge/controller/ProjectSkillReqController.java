package com.talentbridge.controller;

import com.talentbridge.model.ProjectSkillReq;
import com.talentbridge.service.ProjectSkillReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project-requirements")
public class ProjectSkillReqController {
    
    @Autowired
    private ProjectSkillReqService projectSkillReqService;
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectSkillReq>> getProjectRequirements(@PathVariable Integer projectId) {
        return ResponseEntity.ok(projectSkillReqService.getProjectRequirements(projectId));
    }
    
    @PostMapping
    public ResponseEntity<?> addRequirement(@RequestBody ProjectSkillReq req) {
        Integer id = projectSkillReqService.addRequirement(req);
        return ResponseEntity.ok(Map.of("id", id, "message", "Requirement added successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequirement(@PathVariable Integer id, @RequestBody ProjectSkillReq req) {
        req.setId(id);
        projectSkillReqService.updateRequirement(req);
        return ResponseEntity.ok(Map.of("message", "Requirement updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequirement(@PathVariable Integer id) {
        projectSkillReqService.deleteRequirement(id);
        return ResponseEntity.ok(Map.of("message", "Requirement deleted successfully"));
    }
}