package com.talentbridge.dao;

import com.talentbridge.model.Task;
import java.util.List;

public interface TaskDao {
    Integer save(Task task);
    void update(Task task);
    void updateStatus(Integer taskId, String status, String completedWork, String pendingWork);
    Task findById(Integer taskId);
    List<Task> findByTeamId(Integer teamId);
    List<Task> findByAssignedTo(Integer userId);
    void delete(Integer taskId);
}
