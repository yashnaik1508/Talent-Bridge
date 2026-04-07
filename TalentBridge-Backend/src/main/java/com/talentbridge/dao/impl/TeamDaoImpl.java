package com.talentbridge.dao.impl;

import com.talentbridge.dao.TeamDao;
import com.talentbridge.model.Team;
import com.talentbridge.model.TeamMember;
import com.talentbridge.model.TeamMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class TeamDaoImpl implements TeamDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Team> teamRowMapper = (rs, rowNum) -> {
        Team t = new Team();
        t.setTeamId(rs.getInt("team_id"));
        t.setName(rs.getString("name"));
        t.setProjectId(rs.getInt("project_id"));
        t.setCreatedBy(rs.getInt("created_by"));
        t.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        
        try { t.setProjectName(rs.getString("project_name")); } catch (Exception ignored) {}
        try { t.setCreatorName(rs.getString("creator_name")); } catch (Exception ignored) {}
        try { t.setMemberCount(rs.getInt("member_count")); } catch (Exception ignored) {}
        
        return t;
    };

    private final RowMapper<TeamMember> memberRowMapper = (rs, rowNum) -> {
        TeamMember m = new TeamMember();
        m.setId(rs.getInt("id"));
        m.setTeamId(rs.getInt("team_id"));
        m.setUserId(rs.getInt("user_id"));
        m.setRole(rs.getString("role"));
        
        try { m.setUserName(rs.getString("user_name")); } catch (Exception ignored) {}
        try { m.setUserEmail(rs.getString("user_email")); } catch (Exception ignored) {}
        try { m.setSystemRole(rs.getString("system_role")); } catch (Exception ignored) {}
        
        return m;
    };

    private final RowMapper<TeamMessage> messageRowMapper = (rs, rowNum) -> {
        TeamMessage tm = new TeamMessage();
        tm.setMessageId(rs.getInt("message_id"));
        tm.setTeamId(rs.getInt("team_id"));
        tm.setUserId(rs.getInt("user_id"));
        tm.setMessage(rs.getString("message"));
        tm.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        try { tm.setUserName(rs.getString("user_name")); } catch (Exception ignored) {}
        try { tm.setUserRole(rs.getString("user_role")); } catch (Exception ignored) {}

        return tm;
    };

    @Override
    public Integer saveTeam(Team team) {
        String sql = "INSERT INTO teams (name, project_id, created_by) VALUES (?, ?, ?) RETURNING team_id";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, team.getName());
            ps.setInt(2, team.getProjectId());
            ps.setInt(3, team.getCreatedBy());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public Team findTeamById(Integer teamId) {
        String sql = "SELECT t.*, p.name as project_name, u.full_name as creator_name, " +
                     "(SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) as member_count " +
                     "FROM teams t " +
                     "JOIN projects p ON t.project_id = p.project_id " +
                     "JOIN users u ON t.created_by = u.user_id " +
                     "WHERE t.team_id = ?";
        List<Team> teams = jdbcTemplate.query(sql, teamRowMapper, teamId);
        return teams.isEmpty() ? null : teams.get(0);
    }

    @Override
    public List<Team> findAllTeams() {
        String sql = "SELECT t.*, p.name as project_name, u.full_name as creator_name, " +
                     "(SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) as member_count " +
                     "FROM teams t " +
                     "JOIN projects p ON t.project_id = p.project_id " +
                     "JOIN users u ON t.created_by = u.user_id " +
                     "ORDER BY t.created_at DESC";
        return jdbcTemplate.query(sql, teamRowMapper);
    }

    @Override
    public List<Team> findTeamsByProjectId(Integer projectId) {
        String sql = "SELECT t.*, p.name as project_name, u.full_name as creator_name, " +
                     "(SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) as member_count " +
                     "FROM teams t " +
                     "JOIN projects p ON t.project_id = p.project_id " +
                     "JOIN users u ON t.created_by = u.user_id " +
                     "WHERE t.project_id = ? ORDER BY t.created_at DESC";
        return jdbcTemplate.query(sql, teamRowMapper, projectId);
    }

    @Override
    public List<Team> findTeamsByUserId(Integer userId) {
        String sql = "SELECT t.*, p.name as project_name, u.full_name as creator_name, " +
                     "(SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) as member_count " +
                     "FROM teams t " +
                     "JOIN projects p ON t.project_id = p.project_id " +
                     "JOIN users u ON t.created_by = u.user_id " +
                     "WHERE t.team_id IN (SELECT tm2.team_id FROM team_members tm2 WHERE tm2.user_id = ?) " +
                     "OR t.created_by = ? ORDER BY t.created_at DESC";
        return jdbcTemplate.query(sql, teamRowMapper, userId, userId);
    }

    @Override
    public void updateTeam(Team team) {
        String sql = "UPDATE teams SET name = ? WHERE team_id = ?";
        jdbcTemplate.update(sql, team.getName(), team.getTeamId());
    }

    @Override
    public void deleteTeam(Integer teamId) {
        jdbcTemplate.update("DELETE FROM teams WHERE team_id = ?", teamId);
    }

    @Override
    public boolean isUserInTeam(Integer teamId, Integer userId) {
        String sql = "SELECT COUNT(*) FROM team_members WHERE team_id = ? AND user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, teamId, userId);
        return count != null && count > 0;
    }

    // Members

    @Override
    public void addTeamMember(TeamMember member) {
        String sql = "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?) ON CONFLICT DO NOTHING";
        jdbcTemplate.update(sql, member.getTeamId(), member.getUserId(), member.getRole());
    }

    @Override
    public void removeTeamMember(Integer teamId, Integer userId) {
        String sql = "DELETE FROM team_members WHERE team_id = ? AND user_id = ?";
        jdbcTemplate.update(sql, teamId, userId);
    }

    @Override
    public List<TeamMember> findMembersByTeamId(Integer teamId) {
        String sql = "SELECT tm.*, u.full_name as user_name, u.email as user_email, u.role as system_role " +
                     "FROM team_members tm " +
                     "JOIN users u ON tm.user_id = u.user_id " +
                     "WHERE tm.team_id = ? ORDER BY tm.id ASC";
        return jdbcTemplate.query(sql, memberRowMapper, teamId);
    }

    // Messages

    @Override
    public Integer saveMessage(TeamMessage message) {
        String sql = "INSERT INTO team_messages (team_id, user_id, message) VALUES (?, ?, ?) RETURNING message_id";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, message.getTeamId());
            ps.setInt(2, message.getUserId());
            ps.setString(3, message.getMessage());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public List<TeamMessage> findMessagesByTeamId(Integer teamId) {
        String sql = "SELECT tm.*, u.full_name as user_name, " +
                     "COALESCE((SELECT m.role FROM team_members m WHERE m.team_id = tm.team_id AND m.user_id = tm.user_id LIMIT 1), 'GUEST') as user_role " +
                     "FROM team_messages tm " +
                     "JOIN users u ON tm.user_id = u.user_id " +
                     "WHERE tm.team_id = ? ORDER BY tm.created_at DESC";
        return jdbcTemplate.query(sql, messageRowMapper, teamId);
    }
}
