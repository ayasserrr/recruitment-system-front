# Backend API Specification for Recruitment System

## Overview
This document provides a comprehensive specification for all backend APIs needed to replace the mock data in the frontend recruitment system. The frontend currently uses mock data generators for 7 main components that need real backend integration.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <company_jwt_token>
```

## Core Data Models

### Application/Requisition
```json
{
  "id": number,
  "jobTitle": string,
  "posted": string (YYYY-MM-DD),
  "status": "Draft" | "Active" | "published" | "CV Collection" | "In Progress" | "Final Stage" | "Closed" | "Posted",
  "cvs": number,
  "newToday": number,
  "semantic": number,
  "assessment": number,
  "techInterview": number,
  "hrInterview": number,
  "finalCandidates": number,
  "requisition": {
    "selectedPlatforms": string[],
    "postingStartDate": string (YYYY-MM-DD),
    "postingEndDate": string (YYYY-MM-DD),
    "assessmentType": string,
    "assessmentCandidatesToAdvance": number,
    "technicalInterviewDuration": string,
    "technicalInterviewCandidatesToAdvance": number,
    "hrInterviewDuration": string,
    "hrInterviewCandidatesToAdvance": number
  },
  "postingProgress": [
    {
      "id": number,
      "step": string,
      "status": "completed" | "active" | "pending",
      "date": string (YYYY-MM-DD),
      "time": string,
      "platforms": string[] (optional),
      "count": number (optional),
      "newToday": number (optional),
      "scheduledDate": string (YYYY-MM-DD) (optional)
    }
  ]
}
```

---

## 1. Job Post Management APIs

### GET /applications
Get all applications/requisitions with current status and metrics.

**Response:**
```json
{
  "applications": [Application],
  "totals": {
    "cvs": number,
    "finalCandidates": number,
    "positions": number
  }
}
```

### GET /applications/{id}
Get detailed application information including posting progress.

**Response:**
```json
Application
```

### POST /applications/{id}/posting-progress
Update posting progress step status.

**Request:**
```json
{
  "stepId": number,
  "status": "completed" | "active"
}
```

### GET /applications/{id}/platform-status
Get posting status for each platform.

**Response:**
```json
{
  "platforms": [
    {
      "name": "LinkedIn" | "Indeed" | "Glassdoor",
      "status": "posted" | "scheduled" | "failed",
      "postedDate": string (YYYY-MM-DD),
      "views": number,
      "applications": number
    }
  ]
}
```

---

## 2. Semantic Analysis APIs

### GET /semantic-analysis/applications
Get applications ready for semantic analysis.

**Response:**
```json
{
  "applications": [
    {
      "id": number,
      "jobTitle": string,
      "cvs": number,
      "status": string
    }
  ]
}
```

### GET /semantic-analysis/{applicationId}
Get semantic analysis results for an application.

**Response:**
```json
{
  "jobTitle": string,
  "analysisDate": string (YYYY-MM-DD),
  "requiredSkills": string[],
  "stats": {
    "totalCandidates": number,
    "processed": number,
    "highMatch": number,
    "mediumMatch": number,
    "lowMatch": number,
    "avgScore": number
  },
  "candidates": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "score": number (0-100),
      "match": "Excellent" | "Very Good" | "Good" | "Fair",
      "skills": string[],
      "experience": string,
      "education": string,
      "summary": string,
      "projects": string[]
    }
  ]
}
```

### POST /semantic-analysis/{applicationId}/run
Trigger semantic analysis for an application.

**Response:**
```json
{
  "message": "Analysis started",
  "estimatedCompletion": string (ISO datetime)
}
```

### GET /semantic-analysis/{applicationId}/cv/{candidateId}
Get detailed CV information for a candidate.

**Response:**
```json
{
  "name": string,
  "email": string,
  "phone": string,
  "experience": string,
  "education": string,
  "summary": string,
  "projects": string[],
  "score": number,
  "match": string,
  "skills": string[]
}
```

---

## 3. Technical Assessment APIs

### GET /technical-assessment/applications
Get applications with technical assessment status.

**Response:**
```json
{
  "applications": [
    {
      "id": number,
      "jobTitle": string,
      "semantic": number,
      "assessment": {
        "status": "pending" | "active" | "completed",
        "completed": number
      }
    }
  ]
}
```

### GET /technical-assessment/{applicationId}
Get technical assessment details and results.

**Response:**
```json
{
  "id": number,
  "jobTitle": string,
  "totalCandidates": number,
  "sent": number,
  "completed": number,
  "pending": number,
  "deadline": string (YYYY-MM-DD),
  "status": "pending" | "active" | "completed",
  "avgScore": number,
  "duration": string,
  "questions": number,
  "passingScore": number,
  "candidates": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "score": number (0-100),
      "technical": "Excellent" | "Very Good" | "Good" | "Average",
      "problemSolving": "Outstanding" | "Very Good" | "Good" | "Fair",
      "timeSpent": string,
      "status": "passed" | "failed",
      "codingScore": number,
      "theoryScore": number,
      "completed": string (YYYY-MM-DD),
      "experience": string,
      "education": string,
      "summary": string,
      "projects": string[]
    }
  ]
}
```

### POST /technical-assessment/{applicationId}/send
Send assessment invitations to candidates.

**Request:**
```json
{
  "candidateIds": number[],
  "deadline": string (YYYY-MM-DD)
}
```

### POST /technical-assessment/{applicationId}/reminders
Send reminder emails to pending candidates.

**Response:**
```json
{
  "sent": number,
  "failed": number,
  "candidates": [
    {
      "name": string,
      "email": string,
      "status": "sent" | "failed"
    }
  ]
}
```

---

## 4. Technical Interview APIs

### GET /technical-interview/applications
Get applications with technical interview status.

**Response:**
```json
{
  "applications": [
    {
      "id": number,
      "jobTitle": string,
      "assessment": number,
      "interview": {
        "status": "pending" | "active" | "completed",
        "completed": number
      }
    }
  ]
}
```

### GET /technical-interview/{applicationId}
Get technical interview details and results.

**Response:**
```json
{
  "id": number,
  "jobTitle": string,
  "scheduled": number,
  "completed": number,
  "pending": number,
  "avgScore": number,
  "nextInterview": string,
  "interviewers": string[],
  "duration": string,
  "passingScore": number,
  "status": "pending" | "active" | "completed",
  "candidates": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "technicalScore": number (0-10),
      "problemSolving": number (0-10),
      "systemDesign": number (0-10),
      "coding": number (0-10),
      "communication": number (0-10),
      "overall": number (0-10),
      "status": "Completed" | "Scheduled",
      "interviewer": string,
      "date": string (YYYY-MM-DD),
      "feedback": string,
      "experience": string,
      "education": string,
      "summary": string,
      "projects": string[]
    }
  ]
}
```

### POST /technical-interview/{applicationId}/schedule
Schedule technical interviews for candidates.

**Request:**
```json
{
  "candidateIds": number[],
  "interviewers": string[],
  "duration": string,
  "startDate": string (YYYY-MM-DD),
  "timeSlots": string[]
}
```

---

## 5. HR Interview APIs

### GET /hr-interview/applications
Get applications with HR interview status.

**Response:**
```json
{
  "applications": [
    {
      "id": number,
      "jobTitle": string,
      "techInterview": number,
      "interview": {
        "status": "pending" | "active" | "completed",
        "completed": number
      }
    }
  ]
}
```

### GET /hr-interview/{applicationId}
Get HR interview details and results.

**Response:**
```json
{
  "id": number,
  "jobTitle": string,
  "scheduled": number,
  "completed": number,
  "pending": number,
  "avgScore": number,
  "nextInterview": string,
  "interviewer": string,
  "duration": string,
  "passingScore": number,
  "status": "pending" | "active" | "completed",
  "candidates": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "cultureFit": number (0-10),
      "communication": number (0-10),
      "leadership": number (0-10),
      "motivation": number (0-10),
      "teamwork": number (0-10),
      "overall": number (0-10),
      "status": "Completed" | "Scheduled",
      "interviewer": string,
      "date": string (YYYY-MM-DD),
      "feedback": string,
      "experience": string,
      "education": string,
      "summary": string,
      "projects": string[]
    }
  ]
}
```

### POST /hr-interview/{applicationId}/schedule
Schedule HR interviews for candidates.

**Request:**
```json
{
  "candidateIds": number[],
  "interviewer": string,
  "duration": string,
  "startDate": string (YYYY-MM-DD),
  "timeSlots": string[]
}
```

---

## 6. Final Ranking APIs

### GET /final-ranking/applications
Get applications ready for final ranking.

**Response:**
```json
{
  "applications": [
    {
      "id": number,
      "jobTitle": string,
      "hrInterview": number,
      "topScore": number,
      "status": "Ready" | "Pending"
    }
  ]
}
```

### GET /final-ranking/{applicationId}
Get final ranking results for an application.

**Response:**
```json
{
  "jobTitle": string,
  "stats": {
    "totalCandidates": number,
    "shortlisted": number,
    "finalists": number,
    "avgOverallScore": number,
    "topScore": number,
    "offerAcceptanceRate": number
  },
  "stageScores": {
    "semantic": {"avg": number, "max": number, "min": number},
    "technical": {"avg": number, "max": number, "min": number},
    "techInterview": {"avg": number, "max": number, "min": number},
    "hrInterview": {"avg": number, "max": number, "min": number}
  },
  "candidates": [
    {
      "id": number,
      "name": string,
      "email": string,
      "phone": string,
      "overallScore": number,
      "final_score": number,
      "semantic": number,
      "technical": number,
      "techInterview": number,
      "hrInterview": number,
      "recommendation": "Top Candidate" | "Strong Runner-Up" | "Strong Hire" | "Hire" | "Maybe" | "No Hire",
      "status": "Top Candidate" | "Strong Candidate" | "Good Candidate" | "Needs Review",
      "applicationStatus": "Shortlisted" | "Not Shortlisted" | "Applied",
      "experience": string,
      "education": string,
      "skills": string[],
      "matchedSkills": string[],
      "genaiEvidence": {
        "rag": string[],
        "llm_usage": string[]
      } | null,
      "strengths": string[],
      "concerns": string[],
      "interviewQuestions": string[],
      "notes": string,
      "hireProbability": number
    }
  ]
}
```

### POST /final-ranking/{applicationId}/rank-candidates
Trigger AI-powered ranking of candidates.

**Response:**
```json
{
  "message": "Ranking started",
  "estimatedCompletion": string (ISO datetime)
}
```

### POST /final-ranking/{applicationId}/extend-offer
Extend job offer to a candidate.

**Request:**
```json
{
  "candidateId": number,
  "position": string,
  "salary": string,
  "startDate": string (YYYY-MM-DD),
  "department": string,
  "reportingTo": string,
  "benefits": string,
  "contractType": "full-time" | "contract" | "intern",
  "location": string,
  "notes": string
}
```

---

## 7. Applications Overview APIs

### GET /applications/overview
Get applications overview with totals and metrics.

**Response:**
```json
{
  "applications": [Application],
  "totals": {
    "cvs": number,
    "finalCandidates": number,
    "positions": number
  }
}
```

### GET /applications/{id}/pipeline
Get detailed pipeline information for a specific application.

**Response:**
```json
{
  "application": Application,
  "pipeline": [
    {
      "stage": "CV Collection" | "Semantic Analysis" | "Technical Assessment" | "Technical Interview" | "HR Interview" | "Final Selection",
      "description": string,
      "count": number,
      "threshold": number
    }
  ],
  "progress": {
    "percentage": number,
    "currentStage": string
  }
}
```

---

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": {
    "code": string,
    "message": string,
    "details": object
  }
}
```

Common error codes:
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

---

## Implementation Notes

1. **Data Relationships**: Maintain referential integrity between application stages
2. **Status Updates**: When one stage completes, update subsequent stages automatically
3. **Real-time Updates**: Consider WebSocket for real-time progress updates
4. **File Storage**: CVs and documents should be stored securely with access controls
5. **Audit Trail**: Log all status changes and important actions
6. **Pagination**: Implement pagination for large candidate lists
7. **Search & Filtering**: Add search capabilities across all candidate data
8. **Export**: Support PDF/Excel export for reports and candidate data

---

## Priority Implementation Order

1. **Applications Overview** - Core data structure
2. **Job Post Management** - Basic CRUD operations
3. **Semantic Analysis** - AI integration point
4. **Technical Assessment** - Assessment engine
5. **Technical Interview** - Interview scheduling
6. **HR Interview** - Interview management
7. **Final Ranking** - AI ranking and offers

This specification provides all the data structures and endpoints needed to replace the mock data generators in the frontend with real backend functionality.
