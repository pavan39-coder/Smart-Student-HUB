# Student Activity Record System - Setup Guide

## 📋 Project Overview

Student Activity Record System (SARS) is a complete MERN stack application for managing student activities, projects, and portfolios with admin approval system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd server
npm install
```

**Configure Environment Variables** - Update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/student-activity
JWT_SECRET=your_super_secret_jwt_key_change_in_production
ADMIN_SECRET=your_admin_secret
PORT=5000
NODE_ENV=development
```

**Start Backend**:
```bash
npm run dev
```

#### Optional: Seed Development Data
```bash
npm run seed
```

This creates test accounts:
- admin@example.com / password
- faculty@example.com / password
- student1@example.com / password
- student2@example.com / password

#### 2. Frontend Setup

```bash
cd client
npm install
```

**Configure Environment Variables** - Update `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Start Frontend**:
```bash
npm start
```

The app will run on `http://localhost:3000`

---

## 📁 Project Structure

```
Smart Student Hub/
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Database configuration
│   ├── models/               # MongoDB schemas
│   ├── controllers/          # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, upload, error handling
│   ├── utils/                # Helpers and validators
│   ├── uploads/              # File storage
│   └── index.js              # Entry point
│
└── client/                    # Frontend (React)
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/           # Page components
    │   ├── services/        # API calls & axios config
    │   ├── context/         # Auth context
    │   ├── utils/           # Helpers & constants
    │   ├── styles/          # Tailwind CSS
    │   └── App.js          # Main app component
    └── public/              # Static files
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### User/Student
- `GET /api/user/profile` - Get profile
- `PUT /api/user/update` - Update profile
- `GET /api/user/stats` - Get user stats
- `PUT /api/user/portfolio/toggle` - Toggle portfolio visibility

### Activities
- `POST /api/activity/add` - Add activity with certificate upload
- `GET /api/activity/my` - Get my activities
- `GET /api/activity/:id` - Get single activity
- `PUT /api/activity/:id` - Update activity
- `DELETE /api/activity/:id` - Delete activity

### Admin
- `GET /api/admin/students` - Get all students
- `GET /api/admin/activities/pending` - Get pending activities
- `PUT /api/admin/activity/:id/approve` - Approve activity
- `PUT /api/admin/activity/:id/reject` - Reject activity
- `GET /api/admin/stats` - Get admin statistics

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard (public)
- `GET /api/leaderboard/rank/:userId` - Get user rank

### Projects
- `GET /api/project` - Get all projects
- `GET /api/project/:id` - Get project details
- `GET /api/project/user/:userId` - Get projects by user
- `POST /api/project/add` - Add new project
- `PUT /api/project/:id` - Update project
- `DELETE /api/project/:id` - Delete project

### Portfolio
- `GET /api/portfolio/:portfolioId` - Get public portfolio
- `GET /api/portfolio/pdf/:portfolioId` - Download public portfolio as verified PDF

### Integration
- `GET /api/integration/providers` - Get supported LMS/ERP connector types
- `GET /api/integration/export/student/:studentId` - Export student data for LMS/ERP
- `POST /api/integration/push` - Push student data to an external LMS/ERP endpoint

---

## 🎯 Features

### Student Features
✅ Register and login
✅ Add/edit/delete activities with certificate uploads
✅ View dashboard with stats and charts
✅ Track points and ranking
✅ Create and manage projects with full case studies
✅ View leaderboard
✅ Create public portfolio with unique link
✅ Download public portfolio as verified PDF
✅ Update profile with skills and social links

### Admin Features
✅ Dashboard with statistics
✅ View all students
✅ Approve/reject student activities
✅ Assign points to activities
✅ View pending activity list
✅ NAAC-style report download
✅ Integration support scaffolding for LMS/ERP connectors
✅ Manage students

### Public Features
✅ View public leaderboard
✅ Access public portfolios via unique links
✅ View project details

---

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Sent in Authorization header for protected routes
5. Token expires in 30 days

---

## 📊 Database Models

### User
- name, email, password (hashed)
- role (student/admin)
- portfolioId (unique)
- isPublic
- points, bio, skills
- socialLinks

### Activity
- studentId (ref User)
- title, type, date, description
- certificate (file path)
- status (pending/approved/rejected)
- points, rejectionReason
- approvedBy (ref User)

### Project
- title, description, problem, solution
- techStack, features
- screenshots, githubLink, liveLink
- workflow, challenges, futureImprovements
- createdBy (ref User)
- isPublished

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **React Icons** - Icons

---

## 📝 Demo Credentials

After seeding (create demo data):
```
Student Account:
Email: student@example.com
Password: password

Admin Account:
Email: admin@example.com
Password: password
```

---

## 🚀 Deployment

### Deploy the full application to Vercel

The repository root is configured as a single Vercel project: React is built as a static site and `/api/*` is served by the Express serverless function. MongoDB Atlas stores application data and Vercel Blob stores uploaded certificates.

1. Push the repository to GitHub and import it into Vercel. Keep the project root as the **Root Directory**.
2. Create a MongoDB Atlas database and configure its network access to allow connections from Vercel.
3. In the Vercel project, create and link a **Blob** store for persistent certificate uploads.
4. Add these environment variables in **Project Settings → Environment Variables** for Production (and Preview, if needed):

   | Variable | Value |
   | --- | --- |
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `JWT_SECRET` | A unique, randomly generated secret |
   | `ADMIN_SECRET` | A different secret used when registering an admin |
   | `BLOB_READ_WRITE_TOKEN` | Automatically added when the Vercel Blob store is linked |
   | `CLIENT_URL` | Optional; comma-separated frontend origins if using separate/custom domains |

   `REACT_APP_API_URL` is not required for Vercel; the frontend defaults to the same-origin `/api` endpoint. Do not use the development `.env` files for production.
5. Deploy from the Vercel dashboard. The root `vercel.json` and npm workspaces configure the install, production build, API function, and client-side route fallback.
6. Verify the deployment at `https://<your-domain>/api/health`. The response should indicate that the server is running; API requests also require a reachable MongoDB database.

For local development, copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`, set local secrets, then run `npm install` from the repository root. Start the API and web client in separate terminals with `npm run dev:server` and `npm run dev:client`.

Certificate uploads are limited to 4 MB to stay within Vercel Function request limits. Local development stores files in `server/uploads`; production requires the linked Vercel Blob store.

---

## 🐛 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running locally or MongoDB Atlas is accessible
- Check MONGODB_URI in .env

### CORS Issues
- Frontend and API use the same Vercel origin by default
- Set `CLIENT_URL` to the allowed frontend origin(s) only when using separate/custom domains

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Set PORT=3001 npm start

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 👨‍💻 Development Tips

1. **Hot Reload**: Frontend has hot reload, backend requires nodemon
2. **Testing API**: Use Postman or Insomnia
3. **Database**: Use MongoDB Compass for visual database management
4. **Logging**: Check console for errors

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using MERN Stack**
