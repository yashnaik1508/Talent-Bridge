package com.talentbridge.service;

import com.talentbridge.model.*;
import java.util.List;

public interface MatchService {
    List<MatchResult> findCandidates(Integer projectId, Integer requestedBy);
    MatchResult calculateScore(Integer userId, Integer projectId);
}
