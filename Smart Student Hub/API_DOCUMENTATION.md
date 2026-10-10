# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 🔐 Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional, default: student
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "60d5ec49c1234567890abc12",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "points": 0,
    "portfolioId": "abc12345"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "60d5ec49c1234567890abc12",
    "name": "John Doe",
    "email": "john@example.com",
    // ... full user object
  }
}
```

---

### 👤 User/Student

#### Get Profile
```
GET /user/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "60d5ec49c1234567890abc12",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Full-stack developer",
    "skills": ["React", "Node.js", "MongoDB"],
    "socialLinks": {
      "github": "https://github.com/john",
      "linkedin": "https://linkedin.com/in/john"
    },
    "points": 250,
    "portfolioId": "abc12345",
    "isPublic": true
  }
}
```

#### Update Profile
```
PUT /user/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Updated bio",
  "skills": ["React", "Node.js", "MongoDB", "PostgreSQL"],
  "socialLinks": {
    "github": "https://github.com/john",
    "linkedin": "https://linkedin.com/in/john"
  }
}

Response: Updated user object
```

#### Get User Stats
```
GET /user/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "points": 250,
    "approvedActivities": 5,
    "pendingActivities": 2,
    "rank": 12,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Toggle Portfolio Visibility
```
PUT /user/portfolio/toggle
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Portfolio is now public",
  "data": { ... user object }
}
```

---

### 📝 Activities

#### Add Activity
```
POST /activity/add
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- title: "Hackathon Participation"
- type: "hackathon" // hackathon|competition|workshop|certification|project|internship|publication|other
- date: "2024-01-15"
- description: "Won first prize at xyz hackathon"
- certificate: [file] // optional

Response:
{
  "success": true,
  "data": {
    "id": "60d5ec49c1234567890abc12",
    "title": "Hackathon Participation",
    "type": "hackathon",
    "date": "2024-01-15T00:00:00.000Z",
    "description": "Won first prize at xyz hackathon",
    "status": "pending",
    "points": 0,
    "certificate": {
      "originalName": "certificate.pdf",
      "fileName": "1234567890-12345.pdf",
      "filePath": "/uploads/1234567890-12345.pdf",
      "uploadDate": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

#### Get My Activities
```
GET /activity/my?status=pending&type=hackathon
Authorization: Bearer {token}

Query Params:
- status: pending|approved|rejected (optional)
- type: activity type (optional)

Response:
{
  "success": true,
  "count": 5,
  "data": [ ... array of activities ]
}
```

#### Get Single Activity
```
GET /activity/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { ... activity object }
}
```

#### Update Activity
```
PUT /activity/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data: Same as Add Activity

Response: Updated activity object
```

#### Delete Activity
```
DELETE /activity/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Activity deleted successfully"
}
```

---

### 🏆 Leaderboard

#### Get Leaderboard
```
GET /leaderboard?limit=20&skip=0

Query Params:
- limit: number of records (default: 100)
- skip: pagination offset (default: 0)

Response:
{
  "success": true,
  "totalStudents": 100,
  "count": 20,
  "data": [
    {
      "rank": 1,
      "id": "60d5ec49c1234567890abc12",
      "name": "Top Student",
      "email": "top@example.com",
      "points": 500,
      "portfolioId": "abc12345"
    },
    // ... more students
  ]
}
```

#### Get User Rank
```
GET /leaderboard/rank/{userId}

Response:
{
  "success": true,
  "data": {
    "rank": 12,
    "points": 250,
    "name": "John Doe"
  }
}
```

---

### 📚 Projects

#### Add Project
```
POST /project/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "Full-stack MERN e-commerce application",
  "problem": "Need scalable online store solution",
  "solution": "Built MERN stack with Stripe integration",
  "techStack": [
    { "name": "React", "category": "Frontend" },
    { "name": "Node.js", "category": "Backend" },
    { "name": "MongoDB", "category": "Database" }
  ],
  "features": [
    { "title": "User Auth", "description": "JWT based authentication" },
    { "title": "Payment", "description": "Stripe integration" }
  ],
  "screenshots": [
    { "url": "https://...", "caption": "Homepage" }
  ],
  "githubLink": "https://github.com/...",
  "liveLink": "https://...",
  "workflow": "Followed agile methodology",
  "challenges": "Database optimization",
  "futureImprovements": "Mobile app"
}

Response: Created project object
```

#### Get All Projects
```
GET /project?search=&limit=20&skip=0

Query Params:
- search: search term (optional)
- limit: number of records (default: 20)
- skip: pagination offset (default: 0)

Response:
{
  "success": true,
  "total": 50,
  "count": 20,
  "data": [ ... projects ]
}
```

#### Get Single Project
```
GET /project/{id}

Response: Full project object
```

#### Update Project
```
PUT /project/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body: Same fields as Add Project

Response: Updated project object
```

#### Delete Project
```
DELETE /project/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 👨‍💼 Admin

#### Get All Students
```
GET /admin/students?search=john
Authorization: Bearer {token} // Admin only

Query Params:
- search: search by name or email (optional)

Response:
{
  "success": true,
  "count": 5,
  "data": [ ... students ]
}
```

#### Get Pending Activities
```
GET /admin/activities/pending
Authorization: Bearer {token} // Admin only

Response:
{
  "success": true,
  "count": 10,
  "data": [ ... pending activities ]
}
```

#### Approve Activity
```
PUT /admin/activity/{id}/approve
Authorization: Bearer {token} // Admin only
Content-Type: application/json

{
  "points": 100,
  "adminNotes": "Great work!"
}

Response:
{
  "success": true,
  "message": "Activity approved successfully",
  "data": {
    "activity": { ... },
    "user": { ... } // updated user with new points
  }
}
```

#### Reject Activity
```
PUT /admin/activity/{id}/reject
Authorization: Bearer {token} // Admin only
Content-Type: application/json

{
  "rejectionReason": "Invalid certificate format"
}

Response:
{
  "success": true,
  "message": "Activity rejected",
  "data": { ... activity with rejection reason }
}
```

#### Get Admin Stats
```
GET /admin/stats
Authorization: Bearer {token} // Admin only

Response:
{
  "success": true,
  "data": {
    "totalStudents": 50,
    "totalActivities": 200,
    "approvedActivities": 150,
    "pendingActivities": 30,
    "rejectedActivities": 20,
    "topStudents": [ ... top 10 students ]
  }
}
```

---

### 🌐 Portfolio

#### Get Public Portfolio
```
GET /portfolio/{portfolioId}

Response:
{
  "success": true,
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Full-stack developer",
      "points": 250,
      "skills": ["React", "Node.js"],
      "socialLinks": { ... }
    },
    "activities": [ ... approved activities ],
    "projects": [ ... published projects ]
  }
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Errors

| Error | Status | Cause |
|-------|--------|-------|
| Invalid credentials | 401 | Wrong email/password |
| Not authorized | 401 | Missing/invalid token |
| User already exists | 400 | Email already registered |
| Activity not found | 404 | Invalid activity ID |
| Not authorized | 403 | User role doesn't match |

---

## Rate Limiting

- No strict rate limiting implemented
- Recommend adding in production

---

## Pagination

Standard pagination format:
```
GET /endpoint?limit=20&skip=0

Response includes:
- total: Total count
- count: Returned count
- data: Array of items
```

---

## File Upload

- **Max Size**: 10MB
- **Allowed Types**: PDF, DOC, DOCX, JPG, PNG, GIF
- **Storage**: Local uploads folder
- **URL**: `/uploads/{filename}`

---

**Last Updated**: January 2024
