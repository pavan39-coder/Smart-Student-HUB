# Complete MERN Stack Implementation Guide

## 🎯 Quick Start (5 minutes)

### Step 1: Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (Cloud)
# Update MONGODB_URI in server/.env
```

### Step 2: Install dependencies and configure environment
```bash
npm install
```

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`, then set local credentials.

### Step 3: Start the backend and frontend in separate terminals
```bash
npm run dev:server
```

```bash
npm run dev:client
```

✅ Backend runs on `http://localhost:5000` and frontend runs on `http://localhost:3000`.

---

## 📱 User Flows

### Student Flow
1. **Register** → Create account as student
2. **Dashboard** → View stats, points, rank
3. **Activities** → Add/manage activities with certificates
4. **Leaderboard** → See rankings
5. **Profile** → Update bio, skills, social links
6. **Portfolio** → Make public and share link
7. **Projects** → Create and showcase projects

### Admin Flow
1. **Login** → Access admin panel
2. **Dashboard** → View statistics
3. **Approvals** → Review pending activities
4. **Students** → Manage student list
5. **Assign Points** → Approve/reject activities

---

## 🔑 Key Features Explained

### Activity Management
- Students submit activities with optional certificate
- Admin reviews and approves/rejects
- Points automatically added to student's total
- Activities track status: pending → approved/rejected

### Leaderboard
- Real-time ranking based on points
- Top 3 get medals 🥇🥈🥉
- Pagination support
- Shows student name, email, points

### Portfolio System
- Each student gets unique `portfolioId`
- Can make portfolio public/private
- Public link: `/portfolio/{portfolioId}`
- Displays all approved activities and projects

### Project Showcase
- Full case study format with:
  - Problem & Solution
  - Features list
  - Tech stack
  - Screenshots
  - Challenges & improvements
  - GitHub & Live links
  - Creator info

---

## 📊 Database Relationships

```
User (Students/Admins)
  ├─→ Activity (many)
  ├─→ Project (many)
  └─→ Admin approvals (one way)

Activity
  ├─→ Student (User)
  └─→ Approved by (User - Admin)

Project
  └─→ Created by (User)
```

---

## 🔒 Authentication Flow

1. **Register**: Password hashed with bcryptjs, user created
2. **Login**: Password compared, JWT token generated
3. **Protected Routes**: Token verified in middleware
4. **Token Storage**: localStorage on client
5. **Authorization**: Role-based access control (student/admin)

### JWT Token Structure
```javascript
{
  id: "user_mongodb_id",
  iat: 1234567890,  // issued at
  exp: 1234567890   // expires at (30 days)
}
```

---

## 📤 File Upload System

- **Multer** middleware handles uploads
- **Storage**: Local `uploads/` folder during development; Vercel Blob in production
- **Max Size**: 4MB per file (Vercel Function request limit)
- **Allowed Types**: PDF, DOC, DOCX, JPG, PNG, GIF
- **URL Path**: `/uploads/{filename}`

---

## 🎨 Frontend Architecture

### Component Structure
```
App
├─ Navbar (navigation)
├─ Router
│  ├─ Public Pages
│  │  ├─ HomePage
│  │  ├─ LoginPage
│  │  ├─ RegisterPage
│  │  └─ PublicPortfolioPage
│  ├─ Student Pages
│  │  ├─ DashboardPage
│  │  ├─ ActivitiesPage
│  │  ├─ ProjectsPage
│  │  └─ ProfilePage
│  └─ Admin Pages
│     ├─ AdminDashboardPage
│     ├─ AdminApprovalsPage
│     └─ AdminStudentsPage
├─ AuthContext (global state)
└─ API Service (axios config)
```

### State Management
- **AuthContext**: User authentication state
- **Local State**: Component-level state
- **localStorage**: Token and user info persistence

### API Integration
```javascript
// Axios instance with automatic token injection
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🧪 Testing the System

### Test Activities
1. Add activity with type "hackathon"
2. Request approval
3. Log in as admin
4. Approve with 100 points
5. Check student's updated points

### Test Portfolio
1. Create public portfolio
2. Copy portfolio link
3. Share in new tab
4. Verify content displays correctly

### Test Admin Features
1. Login as admin
2. View dashboard stats
3. Approve/reject activities
4. Check student list

---

## 🚀 Performance Optimizations

### Backend
- Database indexing on frequently queried fields
- Pagination for large datasets
- JWT token expiration (30 days)
- Error handling middleware

### Frontend
- Code splitting with React Router
- Lazy loading of components
- API caching strategies
- Responsive design (mobile-first)

---

## 🔧 Customization Tips

### Add Points Scale
Edit `client/src/utils/constants.js`:
```javascript
export const POINTS_SCALE = {
  hackathon: 100,
  competition: 75,
  // Add custom values
};
```

### Customize Colors
Edit `client/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      // Add custom colors
    },
  },
},
```

### Add New Activity Type
1. Update `Activity` model in `server/models/Activity.js`
2. Add to `ACTIVITY_TYPES` constant in client

---

## 🐛 Debugging Guide

### Frontend Issues
```bash
# Check console for errors
F12 → Console tab

# Redux DevTools (if using Redux)
# Local storage
localStorage.getItem('token')

# Network requests
F12 → Network tab
```

### Backend Issues
```bash
# Check server logs
npm run dev

# MongoDB connection
mongosh (MongoDB shell)
show databases
```

---

## 📋 Checklist for Production

- [ ] Change JWT_SECRET in server/.env
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas
- [ ] Update CORS origin for frontend domain
- [ ] Set up SSL certificate
- [ ] Configure email notifications
- [ ] Set up monitoring/logging
- [ ] Database backups
- [ ] Error reporting (Sentry)

---

## 🤝 API Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 📚 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Performance](https://react.dev/reference/react/memo)
- [MongoDB Query Optimization](https://docs.mongodb.com/manual/tutorial/analyze-query-performance/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)

---

**Happy Coding! 🚀**
