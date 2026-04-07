package com.talentbridge.service;

import com.talentbridge.model.Team;
import com.talentbridge.model.TeamMember;
import com.talentbridge.model.TeamMessage;

import java.util.List;

public interface TeamService {
    Team createTeam(Team team);
    Team getTeamById(Integer teamId);
    List<Team> getAllTeams();
    List<Team> getTeamsForUser(Integer userId);
    void deleteTeam(Integer teamId);

    void addMember(Integer teamId, Integer userId, String role, Integer currentUserId);
    void removeMember(Integer teamId, Integer userId, Integer currentUserId);
    List<TeamMember> getTeamMembers(Integer teamId, Integer currentUserId);

    TeamMessage postMessage(Integer teamId, Integer userId, String messageContext);
    List<TeamMessage> getTeamMessages(Integer teamId, Integer currentUserId);
}
