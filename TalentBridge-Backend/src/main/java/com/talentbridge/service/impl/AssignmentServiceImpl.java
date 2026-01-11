package com.talentbridge.service.impl;

import com.talentbridge.dao.AssignmentDao;
import com.talentbridge.dao.ProjectDao;
import com.talentbridge.dao.UserDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.Assignment;
import com.talentbridge.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentDao assignmentDao;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public Integer assignEmployee(Integer projectId, Integer userId, String role) {
        if (projectDao.findById(projectId) == null)
            throw new ResourceNotFoundException("Project not found");

        if (userDao.findById(userId) == null)
            throw new ResourceNotFoundException("User not found");

        if (assignmentDao.isUserAssigned(userId, projectId))
            throw new CustomException("Employee is already assigned to this project");

        Assignment assignment = new Assignment();
        assignment.setProjectId(projectId);
        assignment.setUserId(userId);
        assignment.setRoleOnProject(role);
        assignment.setStatus("ASSIGNED");

        Integer assignmentId = assignmentDao.save(assignment);

        return assignmentId;
    }

    @Override
    @Transactional
    public void releaseEmployee(Integer assignmentId) {
        Assignment assignment = assignmentDao.findById(assignmentId);

        if (assignment == null)
            throw new ResourceNotFoundException("Assignment not found");

        assignmentDao.releaseAssignment(assignmentId);
    }

    @Override
    public List<Assignment> getProjectAssignments(Integer projectId) {
        if (projectDao.findById(projectId) == null)
            throw new ResourceNotFoundException("Project not found");

        return assignmentDao.findByProjectId(projectId);
    }

    @Override
    public List<Assignment> getUserAssignments(Integer userId) {
        if (userDao.findById(userId) == null)
            throw new ResourceNotFoundException("User not found");

        return assignmentDao.findByUserId(userId);
    }

    // ✅ NEW
    @Override
    public List<Assignment> getAllAssignments() {
        return assignmentDao.findAll();
    }
}
