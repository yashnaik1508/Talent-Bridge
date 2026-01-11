package com.talentbridge.service.impl;

import com.talentbridge.dao.ProjectSkillReqDao;
import com.talentbridge.dao.SkillDao;
import com.talentbridge.dao.ProjectDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.ProjectSkillReq;
import com.talentbridge.service.ProjectSkillReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectSkillReqServiceImpl implements ProjectSkillReqService {
    
    @Autowired
    private ProjectSkillReqDao projectSkillReqDao;
    
    @Autowired
    private ProjectDao projectDao;
    
    @Autowired
    private SkillDao skillDao;
    
    @Override
    public List<ProjectSkillReq> getProjectRequirements(Integer projectId) {
        if (projectDao.findById(projectId) == null) {
            throw new ResourceNotFoundException("Project not found");
        }
        return projectSkillReqDao.findByProjectId(projectId);
    }
    
    @Override
    public Integer addRequirement(ProjectSkillReq req) {
        // Validate project exists
        if (projectDao.findById(req.getProjectId()) == null) {
            throw new ResourceNotFoundException("Project not found");
        }
        
        // Validate skill exists
        if (skillDao.findById(req.getSkillId()) == null) {
            throw new ResourceNotFoundException("Skill not found");
        }
        
        // Validate level
        if (req.getDesiredLevel() < 1 || req.getDesiredLevel() > 5) {
            throw new CustomException("Desired level must be between 1 and 5");
        }
        
        // Validate weight
        if (req.getWeight() != null && (req.getWeight() < 0 || req.getWeight() > 1)) {
            throw new CustomException("Weight must be between 0 and 1");
        }
        
        return projectSkillReqDao.save(req);
    }
    
    @Override
    public void updateRequirement(ProjectSkillReq req) {
        if (req.getDesiredLevel() < 1 || req.getDesiredLevel() > 5) {
            throw new CustomException("Desired level must be between 1 and 5");
        }
        
        if (req.getWeight() != null && (req.getWeight() < 0 || req.getWeight() > 1)) {
            throw new CustomException("Weight must be between 0 and 1");
        }
        
        projectSkillReqDao.update(req);
    }
    
    @Override
    public void deleteRequirement(Integer id) {
        projectSkillReqDao.delete(id);
    }
}