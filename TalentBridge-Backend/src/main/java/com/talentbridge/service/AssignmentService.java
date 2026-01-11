package com.talentbridge.service;

import com.talentbridge.model.Assignment;
import java.util.List;

public interface AssignmentService {
    Integer assignEmployee(Integer projectId, Integer userId, String role);
    void releaseEmployee(Integer assignmentId);
    List<Assignment> getProjectAssignments(Integer projectId);
    List<Assignment> getUserAssignments(Integer userId);

    // ✅ NEW
    List<Assignment> getAllAssignments();
}
