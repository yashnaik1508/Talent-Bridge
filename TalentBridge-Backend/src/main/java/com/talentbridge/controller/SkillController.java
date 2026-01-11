package com.talentbridge.controller;

import com.talentbridge.model.Skill;
import com.talentbridge.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    
    @Autowired
    private SkillService skillService;
    
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }
    
    @GetMapping("/{skillId}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Integer skillId) {
        return ResponseEntity.ok(skillService.getSkillById(skillId));
    }
    
    @PostMapping
    public ResponseEntity<?> createSkill(@RequestBody Skill skill) {
        Integer skillId = skillService.createSkill(skill);
        return ResponseEntity.ok(Map.of("skillId", skillId, "message", "Skill created successfully"));
    }
    
    @PutMapping("/{skillId}")
    public ResponseEntity<?> updateSkill(@PathVariable Integer skillId, @RequestBody Skill skill) {
        skill.setSkillId(skillId);
        skillService.updateSkill(skill);
        return ResponseEntity.ok(Map.of("message", "Skill updated successfully"));
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<?> deleteSkill(@PathVariable Integer skillId) {
        try {
            skillService.deleteSkill(skillId);
            return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}

