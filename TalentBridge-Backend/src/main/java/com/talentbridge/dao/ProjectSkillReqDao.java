package com.talentbridge.dao;

import com.talentbridge.model.ProjectSkillReq;
import java.util.List;

public interface ProjectSkillReqDao {
    List<ProjectSkillReq> findByProjectId(Integer projectId);
    Integer save(ProjectSkillReq req);
    void update(ProjectSkillReq req);
    void delete(Integer id);
}
