package com.talentbridge.service;

import com.talentbridge.model.Project;
import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects(int page, int size);
    Project getProjectById(Integer projectId);
    Integer createProject(Project project);
    void updateProject(Project project);
    List<Project> getProjectsByStatus(String status);

    void deleteProject(Integer projectId);
}
