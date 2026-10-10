import React, { useEffect, useState } from 'react';
import { adminService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const FacultyDashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, pendingRes] = await Promise.all([
          adminService.getAllStudents(),
          adminService.getPendingActivities(),
        ]);

        setStudents(studentsRes.data.data);
        setPending(pendingRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load faculty data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-5">Faculty Dashboard</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Assigned Students</h2>
          <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Activity Reviews</h2>
          <p className="text-3xl font-bold text-indigo-600">{pending.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Student Roster</h3>
          {students.length ? (
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student._id} className="border border-gray-200 p-3 rounded-lg">
                  <p className="font-bold">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  <p className="text-sm text-gray-500">Points: {student.points}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assigned students yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Pending Activities</h3>
          {pending.length ? (
            <ul className="space-y-2">
              {pending.map((activity) => (
                <li key={activity._id} className="border border-gray-200 p-3 rounded-lg">
                  <p className="font-bold">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.type}</p>
                  <p className="text-sm text-gray-500">Student: {activity.studentId?.name || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending activities.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
