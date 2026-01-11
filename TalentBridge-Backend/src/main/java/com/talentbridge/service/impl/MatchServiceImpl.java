package com.talentbridge.service.impl;

import com.talentbridge.dao.*;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.*;
import com.talentbridge.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchServiceImpl implements MatchService {
    
    @Autowired
    private ProjectDao projectDao;
    
    @Autowired
    private ProjectSkillReqDao projectSkillReqDao;
    
    @Autowired
    private EmployeeSkillDao employeeSkillDao;
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private AssignmentDao assignmentDao;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Main method to find candidates for a project
     * This implements the core matching algorithm as specified in the requirements
     */
    @Override
    @Transactional
    public List<MatchResult> findCandidates(Integer projectId, Integer requestedBy) {
        // Validate project exists
        Project project = projectDao.findById(projectId);
        if (project == null) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        
        // Get project skill requirements
        List<ProjectSkillReq> requirements = projectSkillReqDao.findByProjectId(projectId);
        if (requirements.isEmpty()) {
            throw new ResourceNotFoundException("No skill requirements defined for this project");
        }
        
        // Create match record
        Integer matchId = createMatchRecord(projectId, requestedBy);
        
        // Get all employees with at least one required skill
        Set<Integer> requiredSkillIds = requirements.stream()
                .map(ProjectSkillReq::getSkillId)
                .collect(Collectors.toSet());
        
        List<Integer> candidateUserIds = findCandidateEmployees(requiredSkillIds);
        
        // Calculate score for each candidate
        List<MatchResult> results = new ArrayList<>();
        
        for (Integer userId : candidateUserIds) {
            // Skip if already assigned to this project
            if (assignmentDao.isUserAssigned(userId, projectId)) {
                continue;
            }
            
            MatchResult result = calculateScore(userId, projectId);
            result.setMatchId(matchId);
            
            // Save match result to database
            saveMatchResult(result);
            
            results.add(result);
        }
        
        // Sort by total score descending
        results.sort((a, b) -> Float.compare(b.getTotalScore(), a.getTotalScore()));
        
        // Update match status to COMPLETED
        updateMatchStatus(matchId, "COMPLETED");
        
        return results;
    }
    
    /**
     * Calculate match score for a specific user and project
     * 
     * Formula:
     * Total Score = (Skill Score * 0.6) + (Experience Score * 0.3) + (Availability Score * 0.1)
     */
    @Override
    public MatchResult calculateScore(Integer userId, Integer projectId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Get project requirements
        List<ProjectSkillReq> requirements = projectSkillReqDao.findByProjectId(projectId);
        
        // Get employee skills
        List<EmployeeSkill> employeeSkills = employeeSkillDao.findByUserId(userId);
        Map<Integer, EmployeeSkill> skillMap = employeeSkills.stream()
                .collect(Collectors.toMap(EmployeeSkill::getSkillId, es -> es));
        
        // 1. Calculate Skill Score (0-60 points)
        float skillScore = calculateSkillScore(requirements, skillMap);
        
        // 2. Calculate Experience Score (0-30 points)
        float experienceScore = calculateExperienceScore(employeeSkills, requirements);
        
        // 3. Calculate Availability Score (0-10 points)
        float availabilityScore = calculateAvailabilityScore(userId);
        
        // Total Score
        float totalScore = (skillScore * 0.6f) + (experienceScore * 0.3f) + (availabilityScore * 0.1f);
        
        // Create result
        MatchResult result = new MatchResult();
        result.setUserId(userId);
        result.setSkillScore(skillScore);
        result.setExperienceScore(experienceScore);
        result.setAvailabilityScore(availabilityScore);
        result.setTotalScore(totalScore);
        result.setEmployeeName(user.getFullName());
        result.setEmployeeEmail(user.getEmail());
        
        return result;
    }
    
    /**
     * Calculate skill match score
     * For each required skill:
     * - If employee level >= required level: full points (weight * 100)
     * - If employee level < required level: partial points (employeeLevel/requiredLevel * weight * 100)
     * - If skill missing: 0 points
     */
    private float calculateSkillScore(List<ProjectSkillReq> requirements, 
                                     Map<Integer, EmployeeSkill> employeeSkills) {
        float totalScore = 0;
        float totalWeight = 0;
        
        for (ProjectSkillReq req : requirements) {
            float weight = req.getWeight() != null ? req.getWeight() : 1.0f;
            totalWeight += weight;
            
            EmployeeSkill empSkill = employeeSkills.get(req.getSkillId());
            
            if (empSkill != null) {
                int empLevel = empSkill.getLevel();
                int reqLevel = req.getDesiredLevel();
                
                if (empLevel >= reqLevel) {
                    // Employee meets or exceeds requirement
                    totalScore += (weight * 100);
                } else {
                    // Partial credit for lower level
                    float ratio = (float) empLevel / reqLevel;
                    totalScore += (ratio * weight * 100);
                }
            }
            // If skill missing, add 0 points
        }
        
        // Normalize to 100
        if (totalWeight > 0) {
            return (totalScore / totalWeight);
        }
        
        return 0;
    }
    
    /**
     * Calculate experience score based on years of experience
     * Takes the average years of experience across all employee skills
     * Compares with typical requirement (assume 3-5 years for mid-level projects)
     */
    private float calculateExperienceScore(List<EmployeeSkill> employeeSkills, 
                                          List<ProjectSkillReq> requirements) {
        if (employeeSkills.isEmpty()) {
            return 0;
        }
        
        // Calculate average years of experience
        double avgExperience = employeeSkills.stream()
                .mapToInt(EmployeeSkill::getYearsExperience)
                .average()
                .orElse(0);
        
        // Assume required experience based on desired level
        // Level 1-2: 0-2 years, Level 3: 3-5 years, Level 4-5: 5+ years
        int maxDesiredLevel = requirements.stream()
                .mapToInt(ProjectSkillReq::getDesiredLevel)
                .max()
                .orElse(3);
        
        float requiredExperience;
        if (maxDesiredLevel <= 2) {
            requiredExperience = 2;
        } else if (maxDesiredLevel == 3) {
            requiredExperience = 5;
        } else {
            requiredExperience = 7;
        }
        
        // Calculate score (cap at 100)
        float score = (float) ((avgExperience / requiredExperience) * 100);
        return Math.min(score, 100);
    }
    
    /**
     * Calculate availability score
     * Check if user is currently available (not assigned to other projects)
     */
    private float calculateAvailabilityScore(Integer userId) {
        // Check current assignments
        List<Assignment> currentAssignments = assignmentDao.findByUserId(userId);
        
        if (currentAssignments.isEmpty()) {
            return 100; // Fully available
        }
        
        // Check employee_availability table
        String sql = "SELECT percent_available FROM employee_availability " +
                    "WHERE user_id = ? AND (to_date IS NULL OR to_date >= CURRENT_DATE) " +
                    "ORDER BY from_date DESC LIMIT 1";
        
        List<Integer> availability = jdbcTemplate.query(sql, 
            (rs, rowNum) -> rs.getInt("percent_available"), userId);
        
        if (!availability.isEmpty()) {
            return availability.get(0).floatValue();
        }
        
        // Default: if assigned to projects, assume 50% available
        return 50;
    }
    
    /**
     * Find all employees who have at least one of the required skills
     */
    private List<Integer> findCandidateEmployees(Set<Integer> requiredSkillIds) {
        if (requiredSkillIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        String placeholders = String.join(",", Collections.nCopies(requiredSkillIds.size(), "?"));
        String sql = "SELECT DISTINCT es.user_id FROM employee_skills es " +
                    "JOIN users u ON es.user_id = u.user_id " +
                    "WHERE es.skill_id IN (" + placeholders + ") " +
                    "AND u.role = 'EMPLOYEE' AND u.is_active = TRUE";
        
        return jdbcTemplate.query(sql, 
            (rs, rowNum) -> rs.getInt("user_id"), 
            requiredSkillIds.toArray());
    }
    
    /**
     * Create a match record in the database
     */
    private Integer createMatchRecord(Integer projectId, Integer requestedBy) {
        String sql = "INSERT INTO matches (project_id, requested_by, status) " +
                    "VALUES (?, ?, 'PENDING') RETURNING match_id";
        return jdbcTemplate.queryForObject(sql, Integer.class, projectId, requestedBy);
    }
    
    /**
     * Save match result to database
     */
    private void saveMatchResult(MatchResult result) {
        String sql = "INSERT INTO match_results (match_id, user_id, total_score, skill_score, " +
                    "experience_score, availability_score) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, result.getMatchId(), result.getUserId(), 
                           result.getTotalScore(), result.getSkillScore(), 
                           result.getExperienceScore(), result.getAvailabilityScore());
    }
    
    /**
     * Update match status
     */
    private void updateMatchStatus(Integer matchId, String status) {
        String sql = "UPDATE matches SET status = ? WHERE match_id = ?";
        jdbcTemplate.update(sql, status, matchId);
    }
}
