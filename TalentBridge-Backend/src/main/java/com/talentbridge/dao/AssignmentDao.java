package com.talentbridge.dao;

import com.talentbridge.model.*;
import java.util.List;

public interface AssignmentDao {
    List<Assignment> findByProjectId(Integer projectId);
    List<Assignment> findByUserId(Integer userId);
    Assignment findById(Integer assignmentId);
    Integer save(Assignment assignment);
    void update(Assignment assignment);
    void releaseAssignment(Integer assignmentId);
    List<Assignment> findAll();
    boolean isUserAssigned(Integer userId, Integer projectId);
}
