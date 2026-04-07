package com.talentbridge.service;

import com.talentbridge.model.*;
import java.util.List;

public interface ProjectSkillReqService {
    List<ProjectSkillReq> getProjectRequirements(Integer projectId);
    Integer addRequirement(ProjectSkillReq req);
    void updateRequirement(ProjectSkillReq req);
    void deleteRequirement(Integer id);
}
