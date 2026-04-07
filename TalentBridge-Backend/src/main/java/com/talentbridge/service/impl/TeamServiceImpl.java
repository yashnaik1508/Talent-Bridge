package com.talentbridge.service.impl;

import com.talentbridge.dao.TeamDao;
import com.talentbridge.dao.UserDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.Team;
import com.talentbridge.model.TeamMember;
import com.talentbridge.model.TeamMessage;
import com.talentbridge.model.User;
import com.talentbridge.service.NotificationService;
import com.talentbridge.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamServiceImpl implements TeamService {

    @Autowired
    private TeamDao teamDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public Team createTeam(Team team) {
        Integer teamId = teamDao.saveTeam(team);
        team.setTeamId(teamId);

        // Add creator as LEADER
        teamDao.addTeamMember(new TeamMember(teamId, team.getCreatedBy(), "LEADER"));
        return teamDao.findTeamById(teamId);
    }

    @Override
    public Team getTeamById(Integer teamId) {
        Team t = teamDao.findTeamById(teamId);
        if (t == null) throw new ResourceNotFoundException("Team not found");
        return t;
    }

    @Override
    public List<Team> getAllTeams() {
        return teamDao.findAllTeams();
    }

    @Override
    public List<Team> getTeamsForUser(Integer userId) {
        User user = userDao.findById(userId);
        if (user != null && "ADMIN".equals(user.getRole())) {
            return teamDao.findAllTeams();
        }
        return teamDao.findTeamsByUserId(userId);
    }

    @Override
    public void deleteTeam(Integer teamId) {
        teamDao.deleteTeam(teamId);
    }

    @Override
    @Transactional
    public void addMember(Integer teamId, Integer userId, String role, Integer currentUserId) {
        if (teamId == null || userId == null) {
            throw new CustomException("Team ID and Employee ID are required", "400");
        }

        validateAccess(teamId, currentUserId);
        
        Team team = getTeamById(teamId); // Will throw ResourceNotFoundException if team doesnt exist
        
        User employee = userDao.findById(userId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee does not exist");
        }
        
        boolean exists = teamDao.isUserInTeam(teamId, userId);
        
        if (exists) {
            throw new CustomException("Employee is already a member of this team", "409");
        }

        teamDao.addTeamMember(new TeamMember(teamId, userId, role != null ? role : "MEMBER"));
        notificationService.createNotification(userId, 
            "You have been added to team: " + team.getName(), "TEAM_UPDATE");
    }

    @Override
    @Transactional
    public void removeMember(Integer teamId, Integer userId, Integer currentUserId) {
        validateAccess(teamId, currentUserId);
        
        Team team = getTeamById(teamId);
        teamDao.removeTeamMember(teamId, userId);
        
        // Only notify if not removing oneself
        if (!userId.equals(currentUserId)) {
            notificationService.createNotification(userId, 
                "You have been removed from team: " + team.getName(), "TEAM_UPDATE");
        }
    }

    @Override
    public List<TeamMember> getTeamMembers(Integer teamId, Integer currentUserId) {
        validateAccess(teamId, currentUserId);
        return teamDao.findMembersByTeamId(teamId);
    }

    @Override
    public TeamMessage postMessage(Integer teamId, Integer userId, String messageContext) {
        if (!teamDao.isUserInTeam(teamId, userId)) {
            User user = userDao.findById(userId);
            if(user == null || !"ADMIN".equals(user.getRole())) {
                throw new CustomException("You are not part of this team and cannot post messages.", "403");
            }
        }
        
        TeamMessage tm = new TeamMessage(teamId, userId, messageContext);
        Integer id = teamDao.saveMessage(tm);
        tm.setMessageId(id);
        
        // Don't fetch back just build out the result or we can rely on frontend fetching the list again
        return tm;
    }

    @Override
    public List<TeamMessage> getTeamMessages(Integer teamId, Integer currentUserId) {
        validateAccess(teamId, currentUserId);
        return teamDao.findMessagesByTeamId(teamId);
    }

    private void validateAccess(Integer teamId, Integer userId) {
        User user = userDao.findById(userId);
        if (user == null) throw new CustomException("Invalid user", "401");
        
        if ("ADMIN".equals(user.getRole())) return; // Admin has full access
        
        if (!teamDao.isUserInTeam(teamId, userId)) {
            // Check if they are PM or HR (globally). 
            // In many SaaS, a PM/HR can manage any team. 
            // If they shouldn't, we still restrict. But the requirement states PM creates team, manages team.
            if ("PM".equals(user.getRole()) || "PROJECT_MANAGER".equals(user.getRole()) || "HR".equals(user.getRole())) {
                return; // PMs and HRs can generally administer teams.
            }

            throw new CustomException("Access Denied: You are not a member of this team.", "403");
        }
    }
}
