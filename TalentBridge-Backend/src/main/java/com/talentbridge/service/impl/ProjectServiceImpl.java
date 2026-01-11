package com.talentbridge.service.impl;

import com.talentbridge.dao.ProjectDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.Project;
import com.talentbridge.service.ProjectService;
import com.talentbridge.util.PagingUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "OPEN", "ONGOING", "ON HOLD", "COMPLETED", "CANCELLED"
    );

    @Autowired
    private ProjectDao projectDao;

    @Override
    public List<Project> getAllProjects(int page, int size) {
        page = PagingUtil.validatePage(page);
        size = PagingUtil.validateSize(size);
        int offset = PagingUtil.calculateOffset(page, size);
        return projectDao.findAll(offset, size);
    }

    @Override
    public Project getProjectById(Integer projectId) {
        Project project = projectDao.findById(projectId);
        if (project == null) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        return project;
    }

    @Override
    public Integer createProject(Project project) {
        // normalize and validate status
        String status = normalizeStatus(project.getStatus());
        project.setStatus(status != null ? status : "OPEN");
        return projectDao.save(project);
    }

    @Override
    public void updateProject(Project project) {
        if (projectDao.findById(project.getProjectId()) == null) {
            throw new ResourceNotFoundException("Project not found");
        }
        // normalize and validate status if provided
        if (project.getStatus() != null) {
            project.setStatus(normalizeStatus(project.getStatus()));
        }
        projectDao.update(project);
    }

    @Override
    public void deleteProject(Integer projectId) {
        if (projectDao.findById(projectId) == null) {
            throw new ResourceNotFoundException("Project not found");
        }
        projectDao.delete(projectId);
    }

    @Override
    public List<Project> getProjectsByStatus(String status) {
        if (status == null) {
            return projectDao.findAll(0, 100); // fallback
        }
        String ns = normalizeStatus(status);
        if (ns == null) throw new CustomException("Invalid project status: " + status);
        return projectDao.findByStatus(ns);
    }

    private String normalizeStatus(String input) {
        if (input == null) return null;
        String s = input.trim().toUpperCase();

        // map common synonyms to canonical values
        if (s.equals("ACTIVE")) s = "OPEN";
        if (s.equals("IN PROGRESS") || s.equals("IN_PROGRESS")) s = "ONGOING";
        if (s.equals("ON_HOLD")) s = "ON HOLD";

        // allowed check
        if (!ALLOWED_STATUSES.contains(s)) {
            throw new CustomException("Status must be one of: " +
                    ALLOWED_STATUSES.stream().collect(Collectors.joining(", ")));
        }
        return s;
    }
}
