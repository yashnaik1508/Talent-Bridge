package com.talentbridge.controller;

import com.talentbridge.model.MatchResult;
import com.talentbridge.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/match")
public class MatchController {
    
    @Autowired
    private MatchService matchService;
    
    @PostMapping("/find-candidates/{projectId}")
    public ResponseEntity<List<MatchResult>> findCandidates(
            @PathVariable Integer projectId,
            Authentication authentication) {
        Integer requestedBy = (Integer) authentication.getPrincipal();
        List<MatchResult> candidates = matchService.findCandidates(projectId, requestedBy);
        return ResponseEntity.ok(candidates);
    }
    
    @GetMapping("/score/{projectId}/{userId}")
    public ResponseEntity<MatchResult> getScore(
            @PathVariable Integer projectId,
            @PathVariable Integer userId) {
        MatchResult result = matchService.calculateScore(userId, projectId);
        return ResponseEntity.ok(result);
    }
}
