package com.talentbridge.dao;

import com.talentbridge.model.Project;
import java.util.List;

public interface ProjectDao {
    List<Project> findAll(int offset, int limit);
    Project findById(Integer projectId);
    Integer save(Project project);
    void update(Project project);
    void delete(Integer projectId);
    List<Project> findByStatus(String status);
    int count();
}
