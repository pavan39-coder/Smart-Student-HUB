const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Project = require('./models/Project');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding');

    // Clear old data (CAUTION: use only in development)
    await Promise.all([User.deleteMany(), Activity.deleteMany(), Project.deleteMany()]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    });

    const faculty = await User.create({
      name: 'Faculty User',
      email: 'faculty@example.com',
      password: 'password',
      role: 'faculty',
    });

    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@example.com',
      password: 'password',
      role: 'student',
      supervisor: faculty._id,
      isPublic: true,
      points: 35,
      skills: ['JavaScript', 'React'],
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@example.com',
      password: 'password',
      role: 'student',
      supervisor: faculty._id,
      isPublic: false,
      points: 18,
      skills: ['Node.js', 'Express'],
    });

    await Activity.create({
      studentId: student1._id,
      title: 'Hackathon Victory',
      type: 'hackathon',
      date: new Date(),
      description: 'Won first place in university hackathon.',
      status: 'approved',
      points: 20,
      approvedBy: admin._id,
      adminNotes: 'Great work',
    });

    await Activity.create({
      studentId: student2._id,
      title: 'AWS Certification',
      type: 'certification',
      date: new Date(),
      description: 'Completed AWS Certified Cloud Practitioner.',
      status: 'pending',
      points: 0,
    });

    await Project.create({
      title: 'Smart Campus App',
      description: 'A fullstack app to manage campus resources and events.',
      problem: 'Disjointed manual process for event registration.',
      solution: 'Centralized dashboard with automations.',
      techStack: [
        { name: 'React', category: 'frontend' },
        { name: 'Node', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
      ],
      features: [
        { title: 'Dashboard', description: 'Role based dashboards for students, faculty and admin' },
        { title: 'Approvals', description: 'Activity approval workflow for faculty/admin' },
        { title: 'Analytics', description: 'Track points, rank and student statistics' },
      ],
      createdBy: student1._id,
      isPublished: true,
    });

    console.log('Seed data created:');
    console.log('Admin: admin@example.com / password');
    console.log('Faculty: faculty@example.com / password');
    console.log('Students: student1@example.com / password, student2@example.com / password');
    process.exit();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();