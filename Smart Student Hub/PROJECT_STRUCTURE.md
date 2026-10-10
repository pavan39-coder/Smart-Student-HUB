# Project Structure & File Organization

## Complete Directory Tree

```
Smart Student Hub/
│
├── 📄 README.md                          # Main documentation
├── 📄 IMPLEMENTATION_GUIDE.md             # Setup and usage guide
├── 📄 API_DOCUMENTATION.md               # API reference
│
├─ server/                                # Backend (Node.js + Express)
│  │
│  ├── 📄 index.js                        # Entry point
│  ├── 📄 package.json                    # Dependencies
│  ├── 📄 .env                            # Environment variables
│  ├── 📄 .gitignore                      # Git ignore rules
│  │
│  ├─ config/
│  │  └── 📄 db.js                        # MongoDB connection
│  │
│  ├─ models/                             # Data schemas
│  │  ├── 📄 User.js                      # Student/Admin schema
│  │  ├── 📄 Activity.js                  # Activity schema
│  │  └── 📄 Project.js                   # Project schema
│  │
│  ├─ controllers/                        # Business logic
│  │  ├── 📄 authController.js            # Auth logic
│  │  ├── 📄 userController.js            # User/profile logic
│  │  ├── 📄 activityController.js        # Activity logic
│  │  ├── 📄 adminController.js           # Admin logic
│  │  ├── 📄 leaderboardController.js     # Leaderboard logic
│  │  ├── 📄 projectController.js         # Project logic
│  │  └── 📄 portfolioController.js       # Portfolio logic
│  │
│  ├─ routes/                             # API endpoints
│  │  ├── 📄 authRoutes.js                # Auth endpoints
│  │  ├── 📄 userRoutes.js                # User endpoints
│  │  ├── 📄 activityRoutes.js            # Activity endpoints
│  │  ├── 📄 adminRoutes.js               # Admin endpoints
│  │  ├── 📄 leaderboardRoutes.js         # Leaderboard endpoints
│  │  ├── 📄 projectRoutes.js             # Project endpoints
│  │  └── 📄 portfolioRoutes.js           # Portfolio endpoints
│  │
│  ├─ middleware/                         # Middleware functions
│  │  ├── 📄 auth.js                      # JWT verification
│  │  ├── 📄 errorHandler.js              # Error handling
│  │  └── 📄 upload.js                    # File upload config
│  │
│  ├─ utils/                              # Utility functions
│  │  ├── 📄 validators.js                # Input validation
│  │  ├── 📄 errorResponse.js             # Error handling
│  │  └── 📄 helpers.js                   # Helper functions
│  │
│  └─ uploads/                            # Certificate storage
│     └── [certificate files]
│
├─ client/                                # Frontend (React)
│  │
│  ├── 📄 package.json                    # Dependencies
│  ├── 📄 .env                            # Environment variables
│  ├── 📄 .gitignore                      # Git ignore rules
│  ├── 📄 tailwind.config.js              # Tailwind config
│  ├── 📄 postcss.config.js               # PostCSS config
│  │
│  ├─ public/
│  │  └── 📄 index.html                   # HTML template
│  │
│  └─ src/
│     │
│     ├── 📄 index.js                     # React entry point
│     ├── 📄 App.js                       # Main app component
│     │
│     ├─ components/                      # Reusable components
│     │  ├── 📄 Navbar.js                 # Navigation bar
│     │  ├── 📄 ActivityCard.js           # Activity card
│     │  ├── 📄 ProjectCard.js            # Project card
│     │  ├── 📄 LoadingSpinner.js         # Loading spinner
│     │  ├── 📄 ErrorMessage.js           # Error display
│     │  └── 📄 SuccessMessage.js         # Success display
│     │
│     ├─ pages/                           # Page components
│     │  ├── 📄 HomePage.js               # Landing page
│     │  ├── 📄 LoginPage.js              # Login page
│     │  ├── 📄 RegisterPage.js           # Registration page
│     │  ├── 📄 DashboardPage.js          # Student dashboard
│     │  ├── 📄 ActivitiesPage.js         # Activities management
│     │  ├── 📄 ProjectsPage.js           # Projects listing
│     │  ├── 📄 ProjectDetailPage.js      # Project details
│     │  ├── 📄 LeaderboardPage.js        # Public leaderboard
│     │  ├── 📄 ProfilePage.js            # Student profile
│     │  ├── 📄 PublicPortfolioPage.js    # Portfolio view
│     │  ├── 📄 AdminDashboardPage.js     # Admin dashboard
│     │  ├── 📄 AdminApprovalsPage.js     # Approvals management
│     │  └── 📄 AdminStudentsPage.js      # Students list
│     │
│     ├─ services/                        # API services
│     │  ├── 📄 api.js                    # Axios configuration
│     │  └── 📄 authService.js            # API endpoints
│     │
│     ├─ context/                         # Context/State
│     │  ├── 📄 AuthContext.js            # Auth context provider
│     │  └── 📄 useAuth.js                # Auth hook
│     │
│     ├─ utils/                           # Utilities
│     │  ├── 📄 helpers.js                # Helper functions
│     │  └── 📄 constants.js              # Constants
│     │
│     ├─ styles/                          # Styling
│     │  └── 📄 index.css                 # Global styles
│     │
│     └─ layouts/
│        └── 📄 Root.js                   # Root layout
```

---

## 📊 Database Schema Overview

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('student' | 'admin'),
  bio: String,
  skills: [String],
  socialLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  points: Number,
  portfolioId: String,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  title: String,
  type: String,
  date: Date,
  description: String,
  certificate: {
    originalName: String,
    fileName: String,
    filePath: String,
    uploadDate: Date
  },
  status: String ('pending' | 'approved' | 'rejected'),
  points: Number,
  rejectionReason: String,
  approvedBy: ObjectId (ref: User),
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  problem: String,
  solution: String,
  techStack: [{ name: String, category: String }],
  features: [{ title: String, description: String }],
  screenshots: [{ url: String, caption: String }],
  githubLink: String,
  liveLink: String,
  workflow: String,
  challenges: String,
  futureImprovements: String,
  createdBy: ObjectId (ref: User),
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow
```
User Registration
    ↓
Validate Input
    ↓
Hash Password (bcryptjs)
    ↓
Create User in DB
    ↓
Generate JWT Token
    ↓
Return Token + User Data
    ↓
Store in localStorage
```

### Activity Approval Flow
```
Student Submits Activity
    ↓
Activity Status: "pending"
    ↓
Admin Reviews
    ↓
Admin Approves with Points
    ↓
Activity Status: "approved"
    ↓
Points Added to User Total
    ↓
Leaderboard Updates
```

### Portfolio Generation
```
User Makes Portfolio Public
    ↓
Generate Unique portfolioId
    ↓
Set isPublic: true
    ↓
Public Link: /portfolio/{portfolioId}
    ↓
Anyone Can Access
    ↓
Shows Activities + Projects
```

---

## 🔗 API Communication Pattern

```
Frontend (React)
    ↓ (axios request)
    ↓ (includes JWT token)
    ↓
API Middleware (auth, validation)
    ↓
Controller (business logic)
    ↓
Model (database operation)
    ↓
Database (MongoDB)
    ↓
Response Sent Back
    ↓
Frontend Updates State
    ↓
UI Re-renders
```

---

## 📦 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/student-activity
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Feature Matrix

| Feature | Student | Admin | Public |
|---------|---------|-------|--------|
| View Dashboard | ✅ | ✅ | ❌ |
| Add Activities | ✅ | ❌ | ❌ |
| Edit Profile | ✅ | ❌ | ❌ |
| View Portfolio | ✅ (own) | ✅ | ✅ (public) |
| Approve Activities | ❌ | ✅ | ❌ |
| Manage Students | ❌ | ✅ | ❌ |
| View Leaderboard | ✅ | ✅ | ✅ |
| Create Projects | ✅ | ❌ | ❌ |

---

## 🔐 Security Checklist

- [x] Password hashing with bcryptjs
- [x] JWT token authentication
- [x] Protected routes with middleware
- [x] Role-based access control
- [x] Input validation
- [x] CORS configuration
- [x] Error handling
- [ ] Rate limiting (TODO)
- [ ] HTTPS in production
- [ ] Environment variables hidden

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Using Tailwind CSS:
- `sm:` (640px)
- `md:` (768px)
- `lg:` (1024px)
- `xl:` (1280px)

---

## 🚀 Performance Metrics

- **Backend Load Time**: < 100ms
- **Database Query Time**: < 50ms
- **Frontend Load Time**: < 2s
- **API Response Time**: < 200ms

---

**Document Version**: 1.0
**Last Updated**: January 2024
