# Detailed Backend API Specifications for Recruitment System

## Base Configuration
```
Base URL: http://localhost:8000/api/v1
Authentication: Bearer <company_jwt_token>
Content-Type: application/json
```

---

## 1. JOB POSTING API ENDPOINTS

### Core Job Posting Management

#### GET /job-postings
**Action**: Get all job postings with current status and metrics
**Used by**: JobPost component (applications list)
```json
Response:
{
  "postings": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "posted": "2025-10-15",
      "status": "CV Collection",
      "cvs": 45,
      "newToday": 8,
      "semantic": 30,
      "assessment": 22,
      "techInterview": 10,
      "hrInterview": 7,
      "finalCandidates": 3,
      "requisition": {
        "selectedPlatforms": ["LinkedIn", "Indeed"],
        "postingStartDate": "2025-10-15",
        "postingEndDate": "2025-10-30"
      },
      "postingProgress": [
        {
          "id": 1,
          "step": "Job Post Created",
          "status": "completed",
          "date": "2025-10-15",
          "time": "Submitted"
        },
        {
          "id": 2,
          "step": "Bias Detection",
          "status": "completed",
          "note": "No bias detected",
          "date": "2025-10-15",
          "time": "Auto-check"
        },
        {
          "id": 3,
          "step": "Posted to Platforms",
          "status": "completed",
          "platforms": ["LinkedIn", "Indeed"],
          "date": "2025-10-15",
          "time": "Auto"
        },
        {
          "id": 4,
          "step": "Receiving CVs",
          "status": "active",
          "count": 45,
          "newToday": 8,
          "date": "2025-10-15",
          "time": "Ongoing"
        },
        {
          "id": 5,
          "step": "Closed",
          "status": "pending",
          "scheduledDate": "2025-10-30"
        }
      ]
    }
  ]
}
```

#### GET /job-postings/{id}
**Action**: Get detailed job posting information
**Used by**: JobPost component (selected application view)
```json
Response: Full JobPosting object (same structure as above)
```

#### POST /job-postings/{id}/progress-step
**Action**: Update posting progress step status
**Used by**: JobPost component (when clicking steps)
```json
Request:
{
  "stepId": 4,
  "status": "completed"
}

Response:
{
  "success": true,
  "updatedProgress": [
    // Updated progress array
  ],
  "newStatus": "Posted"
}
```

### Platform Integration

#### GET /job-postings/{id}/platforms
**Action**: Get posting status for each platform
**Used by**: JobPost component (platform details)
```json
Response:
{
  "platforms": [
    {
      "name": "LinkedIn",
      "status": "posted",
      "postedDate": "2025-10-15",
      "views": 1250,
      "applications": 28,
      "engagement": 2.3
    },
    {
      "name": "Indeed",
      "status": "posted", 
      "postedDate": "2025-10-15",
      "views": 890,
      "applications": 17,
      "engagement": 1.9
    }
  ]
}
```

#### POST /job-postings/{id}/platforms/{platform}/post
**Action**: Manually post to a platform
**Used by**: JobPost component (manual posting)
```json
Request:
{
  "platform": "LinkedIn",
  "immediate": true
}

Response:
{
  "success": true,
  "platform": "LinkedIn",
  "postedAt": "2025-10-15T10:30:00Z",
  "postId": "linkedin-12345"
}
```

#### POST /job-postings/{id}/platforms/{platform}/boost
**Action**: Boost/promote posting on platform
**Used by**: JobPost component (promotion features)
```json
Request:
{
  "duration": 7,
  "budget": 100
}

Response:
{
  "success": true,
  "boostId": "boost-67890",
  "expiresAt": "2025-10-22T10:30:00Z"
}
```

### CV Collection Management

#### GET /job-postings/{id}/cvs
**Action**: Get CVs received for this posting
**Used by**: JobPost component (CV management)
```json
Response:
{
  "total": 45,
  "newToday": 8,
  "cvs": [
    {
      "id": 1,
      "candidateName": "John Doe",
      "email": "john@email.com",
      "receivedAt": "2025-10-20T14:30:00Z",
      "source": "LinkedIn",
      "status": "new",
      "semanticScore": null
    }
  ]
}
```

#### POST /job-postings/{id}/close
**Action**: Close job posting and stop CV collection
**Used by**: JobPost component (closing step)
```json
Request:
{
  "reason": "Position filled",
  "notifyCandidates": true
}

Response:
{
  "success": true,
  "closedAt": "2025-10-25T16:00:00Z",
  "finalCVCount": 45
}
```

---

## 2. SEMANTIC ANALYSIS API ENDPOINTS

### Analysis Management

#### GET /semantic-analysis/applications
**Action**: Get applications ready for semantic analysis
**Used by**: SemanticAnalysis component (application selector)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "cvs": 45,
      "status": "CV Collection",
      "posted": "2025-10-15"
    }
  ]
}
```

#### GET /semantic-analysis/{applicationId}
**Action**: Get semantic analysis results
**Used by**: SemanticAnalysis component (main view)
```json
Response:
{
  "jobTitle": "Senior Software Engineer",
  "analysisDate": "2025-10-20",
  "processingTime": 2.5,
  "requiredSkills": [
    "Python", "Java", "System Design", "AWS", "Docker", "SQL", "Algorithms"
  ],
  "stats": {
    "totalCandidates": 45,
    "processed": 40,
    "highMatch": 12,
    "mediumMatch": 16,
    "lowMatch": 12,
    "avgScore": 82.5
  },
  "candidates": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "score": 94,
      "match": "Excellent",
      "skills": ["Python", "ML", "AWS", "System Design", "Leadership"],
      "experience": "5+ years",
      "education": "Bachelor's in Computer Science",
      "summary": "Experienced software engineer with strong technical skills",
      "projects": [
        "Led development of microservices architecture",
        "Implemented machine learning pipeline",
        "Built real-time analytics dashboard"
      ]
    }
  ]
}
```

#### POST /semantic-analysis/{applicationId}/run
**Action**: Trigger semantic analysis
**Used by**: SemanticAnalysis component (start analysis)
```json
Request:
{
  "candidateIds": [1, 2, 3], // optional, null for all
  "priority": "high"
}

Response:
{
  "analysisId": "analysis-12345",
  "status": "started",
  "estimatedCompletion": "2025-10-20T15:30:00Z",
  "candidatesQueued": 45
}
```

#### GET /semantic-analysis/{applicationId}/status/{analysisId}
**Action**: Check analysis progress
**Used by**: SemanticAnalysis component (progress tracking)
```json
Response:
{
  "analysisId": "analysis-12345",
  "status": "processing",
  "progress": 65,
  "processed": 29,
  "total": 45,
  "estimatedCompletion": "2025-10-20T15:30:00Z"
}
```

### Candidate Details

#### GET /semantic-analysis/{applicationId}/candidate/{candidateId}
**Action**: Get detailed candidate analysis
**Used by**: SemanticAnalysis component (CV modal)
```json
Response:
{
  "candidate": {
    "name": "Ahmed Ali",
    "email": "ahmed@email.com",
    "phone": "+1 555-0123",
    "score": 94,
    "match": "Excellent",
    "skills": ["Python", "ML", "AWS", "System Design", "Leadership"],
    "skillMatches": [
      {
        "skill": "Python",
        "found": true,
        "confidence": 0.95,
        "context": "5 years experience"
      }
    ],
    "experience": "5+ years",
    "education": "Bachelor's in Computer Science",
    "summary": "Experienced software engineer with strong technical skills",
    "projects": [
      {
        "title": "Microservices Architecture",
        "description": "Led development serving 1M+ users",
        "technologies": ["Python", "Docker", "Kubernetes"]
      }
    ]
  }
}
```

#### POST /semantic-analysis/{applicationId}/candidate/{candidateId}/shortlist
**Action**: Add/remove candidate from shortlist
**Used by**: SemanticAnalysis component (star button)
```json
Request:
{
  "action": "add", // or "remove"
  "note": "Strong technical skills, good fit"
}

Response:
{
  "success": true,
  "shortlisted": true,
  "shortlistId": "sl-12345"
}
```

### Reports and Exports

#### GET /semantic-analysis/{applicationId}/report
**Action**: Generate analysis report
**Used by**: SemanticAnalysis component (download report)
```json
Response:
{
  "reportId": "report-67890",
  "downloadUrl": "/api/v1/reports/report-67890.pdf",
  "generatedAt": "2025-10-20T16:00:00Z"
}
```

#### POST /semantic-analysis/{applicationId}/proceed-to-assessment
**Action**: Send candidates to technical assessment
**Used by**: SemanticAnalysis component (proceed button)
```json
Request:
{
  "candidateIds": [1, 2, 3], // candidates with score >= 70
  "assessmentType": "technical"
}

Response:
{
  "success": true,
  "candidatesSent": 12,
  "assessmentId": "assessment-12345"
}
```

---

## 3. TECHNICAL ASSESSMENT API ENDPOINTS

### Assessment Management

#### GET /technical-assessment/applications
**Action**: Get applications with assessment status
**Used by**: TechnicalAssessment component (application selector)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "semantic": 30,
      "assessment": {
        "status": "active",
        "completed": 22,
        "avgScore": 78.5
      }
    }
  ]
}
```

#### GET /technical-assessment/{applicationId}
**Action**: Get assessment details and results
**Used by**: TechnicalAssessment component (main view)
```json
Response:
{
  "id": 1,
  "jobTitle": "Senior Software Engineer",
  "totalCandidates": 30,
  "sent": 28,
  "completed": 22,
  "pending": 6,
  "deadline": "2025-10-27",
  "status": "active",
  "avgScore": 78.5,
  "duration": "60 minutes",
  "questions": 15,
  "passingScore": 70,
  "candidates": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "score": 92,
      "technical": "Excellent",
      "problemSolving": "Outstanding",
      "timeSpent": "52 min",
      "status": "passed",
      "codingScore": 95,
      "theoryScore": 89,
      "completed": "2025-10-22",
      "experience": "5+ years",
      "education": "Bachelor's in Computer Science",
      "summary": "Experienced software engineer with strong technical skills",
      "projects": [
        "Built scalable microservices architecture",
        "Developed machine learning pipeline"
      ]
    }
  ]
}
```

#### POST /technical-assessment/{applicationId}/create
**Action**: Create assessment for candidates
**Used by**: TechnicalAssessment component (create assessment)
```json
Request:
{
  "candidateIds": [1, 2, 3],
  "assessmentType": "technical",
  "duration": 60,
  "questions": 15,
  "deadline": "2025-10-27",
  "passingScore": 70
}

Response:
{
  "assessmentId": "assessment-12345",
  "created": true,
  "candidatesInvited": 28,
  "invitationSentAt": "2025-10-20T10:00:00Z"
}
```

#### POST /technical-assessment/{applicationId}/send-invitations
**Action**: Send assessment invitations
**Used by**: TechnicalAssessment component (send assessments)
```json
Request:
{
  "candidateIds": [1, 2, 3],
  "deadline": "2025-10-27",
  "reminderSchedule": [3, 1] // days before deadline
}

Response:
{
  "success": true,
  "sent": 28,
  "failed": 0,
  "invitationDetails": [
    {
      "candidateId": 1,
      "email": "ahmed@email.com",
      "status": "sent",
      "expiresAt": "2025-10-27T23:59:59Z"
    }
  ]
}
```

### Candidate Management

#### GET /technical-assessment/{applicationId}/candidate/{candidateId}
**Action**: Get candidate assessment details
**Used by**: TechnicalAssessment component (candidate modal)
```json
Response:
{
  "candidate": {
    "name": "Ahmed Ali",
    "email": "ahmed@email.com",
    "phone": "+1 555-0123",
    "score": 92,
    "technical": "Excellent",
    "problemSolving": "Outstanding",
    "timeSpent": "52 min",
    "status": "passed",
    "codingScore": 95,
    "theoryScore": 89,
    "completed": "2025-10-22",
    "questionBreakdown": [
      {
        "category": "Algorithms",
        "score": 88,
        "questions": 5
      },
      {
        "category": "System Design",
        "score": 95,
        "questions": 3
      }
    ]
  }
}
```

#### POST /technical-assessment/{applicationId}/reminders
**Action**: Send reminder emails
**Used by**: TechnicalAssessment component (send reminders)
```json
Request:
{
  "candidateIds": [1, 2, 3], // null for all pending
  "message": "Reminder: Complete your technical assessment"
}

Response:
{
  "success": true,
  "sent": 6,
  "failed": 0,
  "remindersSent": [
    {
      "candidateId": 1,
      "email": "ahmed@email.com",
      "sentAt": "2025-10-25T10:00:00Z"
    }
  ]
}
```

#### POST /technical-assessment/{applicationId}/extend-deadline
**Action**: Extend assessment deadline
**Used by**: TechnicalAssessment component (deadline management)
```json
Request:
{
  "newDeadline": "2025-11-03",
  "reason": "Candidate requests",
  "notifyCandidates": true
}

Response:
{
  "success": true,
  "oldDeadline": "2025-10-27",
  "newDeadline": "2025-11-03",
  "candidatesNotified": 6
}
```

### Results and Progress

#### GET /technical-assessment/{applicationId}/progress
**Action**: Get assessment progress statistics
**Used by**: TechnicalAssessment component (stats overview)
```json
Response:
{
  "stats": {
    "totalAssessments": 1,
    "activeAssessments": 1,
    "completedCandidates": 22,
    "totalCandidates": 30,
    "avgCompletionRate": 73,
    "avgScoreOverall": 78.5
  }
}
```

#### POST /technical-assessment/{applicationId}/proceed-to-interview
**Action**: Send passing candidates to technical interview
**Used by**: TechnicalAssessment component (proceed button)
```json
Request:
{
  "candidateIds": [1, 2, 3], // candidates with score >= 70
  "interviewType": "technical"
}

Response:
{
  "success": true,
  "candidatesAdvanced": 18,
  "interviewId": "interview-12345"
}
```

---

## 4. TECHNICAL INTERVIEW API ENDPOINTS

### Interview Management

#### GET /technical-interview/applications
**Action**: Get applications with interview status
**Used by**: TechnicalInterview component (application selector)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "assessment": 22,
      "interview": {
        "status": "active",
        "completed": 15,
        "avgScore": 8.2
      }
    }
  ]
}
```

#### GET /technical-interview/{applicationId}
**Action**: Get interview details and results
**Used by**: TechnicalInterview component (main view)
```json
Response:
{
  "id": 1,
  "jobTitle": "Senior Software Engineer",
  "scheduled": 18,
  "completed": 15,
  "pending": 3,
  "avgScore": 8.2,
  "nextInterview": "2025-10-26 14:00",
  "interviewers": ["John Smith", "Sarah Lee"],
  "duration": "45 minutes",
  "passingScore": 7.5,
  "status": "active",
  "candidates": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "technicalScore": 8.5,
      "problemSolving": 9.0,
      "systemDesign": 8.0,
      "coding": 8.8,
      "communication": 8.2,
      "overall": 8.7,
      "status": "Completed",
      "interviewer": "John Smith",
      "date": "2025-10-24",
      "feedback": "Strong technical skills and problem-solving abilities",
      "experience": "5+ years",
      "education": "Bachelor's in Computer Science",
      "summary": "Experienced software engineer with strong technical skills",
      "projects": [
        "Built scalable microservices architecture",
        "Developed machine learning pipeline"
      ]
    }
  ]
}
```

#### POST /technical-interview/{applicationId}/schedule
**Action**: Schedule technical interviews
**Used by**: TechnicalInterview component (schedule interviews)
```json
Request:
{
  "candidateIds": [1, 2, 3],
  "interviewers": ["John Smith", "Sarah Lee"],
  "duration": "45",
  "startDate": "2025-10-26",
  "timeSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  "location": "Virtual - Zoom"
}

Response:
{
  "success": true,
  "scheduled": 18,
  "interviewDetails": [
    {
      "candidateId": 1,
      "interviewer": "John Smith",
      "date": "2025-10-26",
      "time": "09:00",
      "location": "Virtual - Zoom",
      "meetingLink": "https://zoom.us/j/123456789"
    }
  ]
}
```

### Interview Operations

#### GET /technical-interview/{applicationId}/candidate/{candidateId}
**Action**: Get candidate interview details
**Used by**: TechnicalInterview component (candidate feedback modal)
```json
Response:
{
  "candidate": {
    "name": "Ahmed Ali",
    "email": "ahmed@email.com",
    "phone": "+1 555-0123",
    "technicalScore": 8.5,
    "problemSolving": 9.0,
    "systemDesign": 8.0,
    "coding": 8.8,
    "communication": 8.2,
    "overall": 8.7,
    "status": "Completed",
    "interviewer": "John Smith",
    "date": "2025-10-24",
    "time": "09:00",
    "duration": "47 minutes",
    "feedback": "Strong technical skills and problem-solving abilities",
    "detailedFeedback": {
      "strengths": [
        "Excellent problem-solving approach",
        "Clean coding practices",
        "Good system design understanding"
      ],
      "areasForImprovement": [
        "Could improve on explaining trade-offs",
        "Needs more experience with distributed systems"
      ]
    }
  }
}
```

#### POST /technical-interview/{applicationId}/reschedule
**Action**: Reschedule interviews
**Used by**: TechnicalInterview component (rescheduling)
```json
Request:
{
  "candidateIds": [1, 2],
  "reason": "Candidate request",
  "newDate": "2025-10-27",
  "availableTimeSlots": ["10:00", "11:00", "14:00"]
}

Response:
{
  "success": true,
  "rescheduled": 2,
  "newInterviews": [
    {
      "candidateId": 1,
      "oldDate": "2025-10-26",
      "newDate": "2025-10-27",
      "newTime": "10:00"
    }
  ]
}
```

#### POST /technical-interview/{applicationId}/cancel
**Action**: Cancel interviews
**Used by**: TechnicalInterview component (cancellation)
```json
Request:
{
  "candidateIds": [1, 2],
  "reason": "Position filled",
  "notifyCandidates": true
}

Response:
{
  "success": true,
  "cancelled": 2,
  "candidatesNotified": 2
}
```

### Feedback and Evaluation

#### POST /technical-interview/{applicationId}/feedback
**Action**: Submit interview feedback
**Used by**: TechnicalInterview component (feedback submission)
```json
Request:
{
  "candidateId": 1,
  "interviewerId": "interviewer-123",
  "scores": {
    "technical": 8.5,
    "problemSolving": 9.0,
    "systemDesign": 8.0,
    "coding": 8.8,
    "communication": 8.2
  },
  "feedback": "Strong technical skills and problem-solving abilities",
  "recommendation": "hire",
  "strengths": [
    "Excellent problem-solving approach",
    "Clean coding practices"
  ],
  "areasForImprovement": [
    "Could improve on explaining trade-offs"
  ]
}

Response:
{
  "success": true,
  "feedbackId": "feedback-12345",
  "overallScore": 8.7,
  "recommendation": "hire"
}
```

#### POST /technical-interview/{applicationId}/proceed-to-hr
**Action**: Send passing candidates to HR interview
**Used by**: TechnicalInterview component (proceed button)
```json
Request:
{
  "candidateIds": [1, 2, 3], // candidates with score >= 7.5
  "hrInterviewType": "cultural"
}

Response:
{
  "success": true,
  "candidatesAdvanced": 12,
  "hrInterviewId": "hr-interview-12345"
}
```

---

## 5. HR INTERVIEW API ENDPOINTS

### HR Interview Management

#### GET /hr-interview/applications
**Action**: Get applications with HR interview status
**Used by**: HRInterview component (application selector)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "techInterview": 15,
      "interview": {
        "status": "active",
        "completed": 12,
        "avgScore": 8.3
      }
    }
  ]
}
```

#### GET /hr-interview/{applicationId}
**Action**: Get HR interview details and results
**Used by**: HRInterview component (main view)
```json
Response:
{
  "id": 1,
  "jobTitle": "Senior Software Engineer",
  "scheduled": 15,
  "completed": 12,
  "pending": 3,
  "avgScore": 8.3,
  "nextInterview": "2025-10-26 15:00",
  "interviewer": "Emma Wilson",
  "duration": "30 minutes",
  "passingScore": 7.5,
  "status": "active",
  "candidates": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "cultureFit": 8.8,
      "communication": 8.5,
      "leadership": 8.2,
      "motivation": 9.0,
      "teamwork": 8.7,
      "overall": 8.6,
      "status": "Completed",
      "interviewer": "Emma Wilson",
      "date": "2025-10-24",
      "feedback": "Excellent cultural fit and communication skills",
      "experience": "5+ years",
      "education": "Bachelor's in Computer Science",
      "summary": "Experienced professional with strong communication skills",
      "projects": [
        "Led cross-functional team of 8 members",
        "Implemented company-wide training program"
      ]
    }
  ]
}
```

#### POST /hr-interview/{applicationId}/schedule
**Action**: Schedule HR interviews
**Used by**: HRInterview component (schedule interviews)
```json
Request:
{
  "candidateIds": [1, 2, 3],
  "interviewer": "Emma Wilson",
  "duration": "30",
  "startDate": "2025-10-26",
  "timeSlots": ["10:00", "11:00", "14:00", "15:00", "16:00"],
  "location": "Virtual - Zoom"
}

Response:
{
  "success": true,
  "scheduled": 15,
  "interviewDetails": [
    {
      "candidateId": 1,
      "interviewer": "Emma Wilson",
      "date": "2025-10-26",
      "time": "10:00",
      "location": "Virtual - Zoom",
      "meetingLink": "https://zoom.us/j/987654321"
    }
  ]
}
```

### HR Interview Operations

#### GET /hr-interview/{applicationId}/candidate/{candidateId}
**Action**: Get candidate HR interview details
**Used by**: HRInterview component (candidate feedback modal)
```json
Response:
{
  "candidate": {
    "name": "Ahmed Ali",
    "email": "ahmed@email.com",
    "phone": "+1 555-0123",
    "cultureFit": 8.8,
    "communication": 8.5,
    "leadership": 8.2,
    "motivation": 9.0,
    "teamwork": 8.7,
    "overall": 8.6,
    "status": "Completed",
    "interviewer": "Emma Wilson",
    "date": "2025-10-24",
    "time": "10:00",
    "duration": "32 minutes",
    "feedback": "Excellent cultural fit and communication skills",
    "detailedFeedback": {
      "strengths": [
        "Strong cultural alignment",
        "Excellent communication",
        "Leadership potential"
      ],
      "concerns": [
        "Limited international experience"
      ]
    }
  }
}
```

#### POST /hr-interview/{applicationId}/feedback
**Action**: Submit HR interview feedback
**Used by**: HRInterview component (feedback submission)
```json
Request:
{
  "candidateId": 1,
  "interviewerId": "hr-interviewer-123",
  "scores": {
    "cultureFit": 8.8,
    "communication": 8.5,
    "leadership": 8.2,
    "motivation": 9.0,
    "teamwork": 8.7
  },
  "feedback": "Excellent cultural fit and communication skills",
  "recommendation": "strong_hire",
  "strengths": [
    "Strong cultural alignment",
    "Excellent communication"
  ],
  "concerns": [
    "Limited international experience"
  ]
}

Response:
{
  "success": true,
  "feedbackId": "hr-feedback-12345",
  "overallScore": 8.6,
  "recommendation": "strong_hire"
}
```

#### POST /hr-interview/{applicationId}/proceed-to-final
**Action**: Send candidates to final ranking
**Used by**: HRInterview component (proceed button)
```json
Request:
{
  "candidateIds": [1, 2, 3], // candidates with score >= 7.5
  "rankingType": "comprehensive"
}

Response:
{
  "success": true,
  "candidatesAdvanced": 10,
  "finalRankingId": "final-ranking-12345"
}
```

---

## 6. FINAL RANKING API ENDPOINTS

### Ranking Management

#### GET /final-ranking/applications
**Action**: Get applications ready for final ranking
**Used by**: FinalRanking component (application selector)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "hrInterview": 12,
      "topScore": 94,
      "status": "Ready"
    }
  ]
}
```

#### GET /final-ranking/{applicationId}
**Action**: Get final ranking results
**Used by**: FinalRanking component (main view)
```json
Response:
{
  "jobTitle": "Senior Software Engineer",
  "stats": {
    "totalCandidates": 12,
    "shortlisted": 8,
    "finalists": 5,
    "avgOverallScore": 85.2,
    "topScore": 94,
    "offerAcceptanceRate": 87
  },
  "stageScores": {
    "semantic": {"avg": 88, "max": 95, "min": 72},
    "technical": {"avg": 82, "max": 92, "min": 68},
    "techInterview": {"avg": 8.3, "max": 9.2, "min": 7.1},
    "hrInterview": {"avg": 8.6, "max": 9.5, "min": 7.8}
  },
  "candidates": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "overallScore": 94,
      "final_score": 94,
      "semantic": 95,
      "technical": 92,
      "techInterview": 9.2,
      "hrInterview": 9.5,
      "recommendation": "Top Candidate",
      "status": "Top Candidate",
      "applicationStatus": "Shortlisted",
      "experience": "5 years",
      "education": "Bachelors in CS",
      "skills": ["Python", "ML", "AWS", "System Design", "Leadership"],
      "matchedSkills": ["Python", "ML", "System Design"],
      "genaiEvidence": {
        "rag": ["faiss", "chromadb"],
        "llm_usage": ["langchain", "gpt-4"]
      },
      "strengths": [
        "Strong system design skills",
        "Excellent communication",
        "Team leadership experience"
      ],
      "concerns": [
        "Limited management experience"
      ],
      "interviewQuestions": [
        "Describe your largest ML project end to end",
        "How do you handle model drift in production?"
      ],
      "notes": "Exceptional candidate with strong technical and leadership skills",
      "hireProbability": 92
    }
  ]
}
```

#### POST /final-ranking/{applicationId}/rank-candidates
**Action**: Trigger AI-powered candidate ranking
**Used by**: FinalRanking component (start ranking)
```json
Request:
{
  "candidateIds": [1, 2, 3], // optional, null for all
  "rankingCriteria": ["technical", "cultural", "potential"],
  "weights": {
    "semantic": 0.25,
    "technical": 0.25,
    "techInterview": 0.25,
    "hrInterview": 0.25
  }
}

Response:
{
  "rankingId": "ranking-12345",
  "status": "started",
  "estimatedCompletion": "2025-10-25T11:30:00Z",
  "candidatesBeingRanked": 12
}
```

#### GET /final-ranking/{applicationId}/ranking-status/{rankingId}
**Action**: Check ranking progress
**Used by**: FinalRanking component (progress tracking)
```json
Response:
{
  "rankingId": "ranking-12345",
  "status": "processing",
  "progress": 75,
  "processed": 9,
  "total": 12,
  "estimatedCompletion": "2025-10-25T11:30:00Z"
}
```

### Candidate Management

#### GET /final-ranking/{applicationId}/candidate/{candidateId}
**Action**: Get detailed candidate ranking report
**Used by**: FinalRanking component (full report modal)
```json
Response:
{
  "candidate": {
    "personalInfo": {
      "name": "Ahmed Ali",
      "email": "ahmed@email.com",
      "phone": "+1 555-0123",
      "location": "San Francisco, CA",
      "experience": "5 years",
      "education": "Bachelors in CS"
    },
    "overallPerformance": {
      "overallScore": 94,
      "rank": 1,
      "totalCandidates": 12,
      "percentile": 95,
      "status": "Top Candidate",
      "recommendation": "Top Candidate",
      "hireProbability": 92
    },
    "stageBreakdown": {
      "semantic": {"score": 95, "rank": 1},
      "technical": {"score": 92, "rank": 2},
      "techInterview": {"score": 9.2, "rank": 1},
      "hrInterview": {"score": 9.5, "rank": 1}
    },
    "aiAnalysis": {
      "strengths": [
        "Strong system design skills",
        "Excellent communication",
        "Team leadership experience"
      ],
      "concerns": [
        "Limited management experience"
      ],
      "recommendation": "Top Candidate",
      "confidence": 0.94
    }
  }
}
```

#### POST /final-ranking/{applicationId}/shortlist
**Action**: Update candidate shortlist status
**Used by**: FinalRanking component (shortlist toggle)
```json
Request:
{
  "candidateId": 1,
  "action": "add", // or "remove"
  "note": "Strong technical skills, good cultural fit"
}

Response:
{
  "success": true,
  "shortlisted": true,
  "shortlistId": "sl-12345"
}
```

#### POST /final-ranking/{applicationId}/extend-offer
**Action**: Extend job offer to candidate
**Used by**: FinalRanking component (offer extension)
```json
Request:
{
  "candidateId": 1,
  "position": "Senior Software Engineer",
  "salary": "120000-150000",
  "startDate": "2025-11-15",
  "department": "Engineering",
  "reportingTo": "John Smith",
  "benefits": "Health insurance, 401(k), unlimited PTO, gym membership",
  "contractType": "full-time",
  "location": "San Francisco, CA (Remote/Hybrid)",
  "notes": "Offer extended based on strong performance across all evaluation stages"
}

Response:
{
  "success": true,
  "offerId": "offer-12345",
  "offerDetails": {
    "candidate": "Ahmed Ali",
    "position": "Senior Software Engineer",
    "salary": "120000-150000",
    "startDate": "2025-11-15",
    "expiresAt": "2025-11-08T23:59:59Z"
  }
}
```

### Reports and Analytics

#### GET /final-ranking/{applicationId}/analytics
**Action**: Get ranking analytics and insights
**Used by**: FinalRanking component (analytics view)
```json
Response:
{
  "analytics": {
    "scoreDistribution": {
      "90-100": 2,
      "80-89": 5,
      "70-79": 4,
      "60-69": 1,
      "0-59": 0
    },
    "stagePerformance": {
      "semantic": {"avg": 88, "stdDev": 8.2},
      "technical": {"avg": 82, "stdDev": 12.1},
      "techInterview": {"avg": 8.3, "stdDev": 0.8},
      "hrInterview": {"avg": 8.6, "stdDev": 0.6}
    },
    "recommendationBreakdown": {
      "Top Candidate": 2,
      "Strong Hire": 3,
      "Hire": 4,
      "Maybe": 2,
      "No Hire": 1
    }
  }
}
```

#### GET /final-ranking/{applicationId}/export
**Action**: Export ranking results
**Used by**: FinalRanking component (download reports)
```json
Response:
{
  "exportId": "export-12345",
  "format": "excel", // or "pdf"
  "downloadUrl": "/api/v1/exports/export-12345.xlsx",
  "generatedAt": "2025-10-25T12:00:00Z"
}
```

---

## 7. APPLICATIONS OVERVIEW API ENDPOINTS

### Dashboard Overview

#### GET /applications/overview
**Action**: Get applications overview with totals and metrics
**Used by**: Applications component (main dashboard)
```json
Response:
{
  "applications": [
    {
      "id": 1,
      "jobTitle": "Senior Software Engineer",
      "posted": "2025-10-15",
      "status": "Final Stage",
      "cvs": 45,
      "newToday": 8,
      "semantic": 30,
      "assessment": 22,
      "techInterview": 10,
      "hrInterview": 7,
      "finalCandidates": 3,
      "requisition": {
        "selectedPlatforms": ["LinkedIn", "Indeed"],
        "postingStartDate": "2025-10-15",
        "postingEndDate": "2025-10-30"
      }
    }
  ],
  "totals": {
    "cvs": 156,
    "finalCandidates": 23,
    "positions": 4
  },
  "recentActivity": [
    {
      "type": "new_cv",
      "applicationId": 1,
      "message": "5 new CVs received for Senior Software Engineer",
      "timestamp": "2025-10-25T10:30:00Z"
    }
  ]
}
```

#### GET /applications/{id}/pipeline
**Action**: Get detailed pipeline information
**Used by**: Applications component (application details)
```json
Response:
{
  "application": {
    "id": 1,
    "jobTitle": "Senior Software Engineer",
    "posted": "2025-10-15",
    "status": "Final Stage",
    "cvs": 45,
    "semantic": 30,
    "assessment": 22,
    "techInterview": 10,
    "hrInterview": 7,
    "finalCandidates": 3,
    "requisition": {
      "selectedPlatforms": ["LinkedIn", "Indeed"],
      "postingStartDate": "2025-10-15",
      "postingEndDate": "2025-10-30",
      "assessmentType": "technical",
      "assessmentCandidatesToAdvance": 20,
      "technicalInterviewDuration": "45",
      "technicalInterviewCandidatesToAdvance": 8,
      "hrInterviewDuration": "30",
      "hrInterviewCandidatesToAdvance": 5
    }
  },
  "pipeline": [
    {
      "stage": "CV Collection",
      "description": "Collect and review CVs",
      "count": 45,
      "threshold": null,
      "completed": true
    },
    {
      "stage": "Semantic Analysis",
      "description": "AI matching & filtering",
      "count": 30,
      "threshold": null,
      "completed": true
    },
    {
      "stage": "Technical Assessment",
      "description": "Online technical test",
      "count": 22,
      "threshold": 20,
      "completed": true
    },
    {
      "stage": "Technical Interview",
      "description": "Technical evaluation",
      "count": 10,
      "threshold": 8,
      "completed": true
    },
    {
      "stage": "HR Interview",
      "description": "Cultural fit assessment",
      "count": 7,
      "threshold": 5,
      "completed": true
    },
    {
      "stage": "Final Selection",
      "description": "Shortlist for decision",
      "count": 3,
      "threshold": null,
      "completed": false
    }
  ],
  "progress": {
    "percentage": 87,
    "currentStage": "Final Selection",
    "nextMilestone": "Hiring Decision"
  }
}
```

### Application Management

#### POST /applications
**Action**: Create new application/requisition
**Used by**: MultiStepForm component (job creation)
```json
Request:
{
  "jobTitle": "Senior Software Engineer",
  "requisition": {
    "selectedPlatforms": ["LinkedIn", "Indeed"],
    "postingStartDate": "2025-10-15",
    "postingEndDate": "2025-10-30",
    "assessmentType": "technical",
    "assessmentCandidatesToAdvance": 20,
    "technicalInterviewDuration": "45",
    "technicalInterviewCandidatesToAdvance": 8,
    "hrInterviewDuration": "30",
    "hrInterviewCandidatesToAdvance": 5
  }
}

Response:
{
  "success": true,
  "applicationId": 123,
  "application": {
    // Full application object
  }
}
```

#### PUT /applications/{id}
**Action**: Update application details
**Used by**: JobPost component (updates)
```json
Request:
{
  "jobTitle": "Senior Software Engineer II",
  "requisition": {
    "postingEndDate": "2025-11-15"
  }
}

Response:
{
  "success": true,
  "updatedApplication": {
    // Updated application object
  }
}
```

#### DELETE /applications/{id}
**Action**: Delete application
**Used by**: Applications component (deletion)
```json
Response:
{
  "success": true,
  "deletedAt": "2025-10-25T12:00:00Z"
}
```

### Analytics and Insights

#### GET /applications/analytics
**Action**: Get recruitment analytics
**Used by**: Applications component (insights)
```json
Response:
{
  "analytics": {
    "timeToHire": {
      "average": 28, // days
      "byPosition": [
        {"position": "Senior Software Engineer", "days": 32},
        {"position": "Data Scientist", "days": 25}
      ]
    },
    "conversionRates": {
      "cvToSemantic": 0.67,
      "semanticToAssessment": 0.73,
      "assessmentToInterview": 0.45,
      "interviewToHire": 0.30
    },
    "sourceEffectiveness": [
      {"source": "LinkedIn", "candidates": 89, "hired": 12},
      {"source": "Indeed", "candidates": 45, "hired": 5}
    ]
  }
}
```

#### GET /applications/activity
**Action**: Get recent activity feed
**Used by**: Applications component (activity feed)
```json
Response:
{
  "activities": [
    {
      "id": 1,
      "type": "application_created",
      "message": "New application created: Senior Data Scientist",
      "timestamp": "2025-10-25T11:00:00Z",
      "user": "John Doe"
    },
    {
      "id": 2,
      "type": "cv_received",
      "message": "3 new CVs received for Senior Software Engineer",
      "timestamp": "2025-10-25T10:30:00Z",
      "applicationId": 1
    }
  ]
}
```

---

## ERROR HANDLING

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "deadline",
      "issue": "Date must be in the future"
    }
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid/missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `BUSINESS_RULE_VIOLATION` - Business logic constraints
- `EXTERNAL_SERVICE_ERROR` - Third-party service failures
- `INTERNAL_ERROR` - Server-side errors

---

## IMPLEMENTATION NOTES

1. **Authentication**: All endpoints require company JWT token
2. **Rate Limiting**: Implement appropriate rate limits for each endpoint type
3. **Pagination**: List endpoints should support pagination (page, limit, sort)
4. **Filtering**: Support filtering by date ranges, status, and other criteria
5. **Audit Trail**: Log all significant actions with user and timestamp
6. **Real-time Updates**: Consider WebSocket for real-time progress updates
7. **File Handling**: CV uploads should be handled securely with virus scanning
8. **Notifications**: Email/SMS notifications for key events
9. **Data Validation**: Strict validation on all input data
10. **Performance**: Optimize for large datasets with proper indexing
