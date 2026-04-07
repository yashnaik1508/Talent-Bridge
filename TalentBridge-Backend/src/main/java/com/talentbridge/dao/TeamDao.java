package com.talentbridge.dao;

import com.talentbridge.model.Team;
import com.talentbridge.model.TeamMember;
import com.talentbridge.model.TeamMessage;

import java.util.List;

public interface TeamDao {
    // Teams
    Integer saveTeam(Team team);
    Team findTeamById(Integer teamId);
    List<Team> findAllTeams();
    List<Team> findTeamsByProjectId(Integer projectId);
    List<Team> findTeamsByUserId(Integer userId);
    void updateTeam(Team team);
    void deleteTeam(Integer teamId);
    
    boolean isUserInTeam(Integer teamId, Integer userId);

    // Team Members
    void addTeamMember(TeamMember member);
    void removeTeamMember(Integer teamId, Integer userId);
    List<TeamMember> findMembersByTeamId(Integer teamId);

    // Team Messages
    Integer saveMessage(TeamMessage message);
    List<TeamMessage> findMessagesByTeamId(Integer teamId);
}
