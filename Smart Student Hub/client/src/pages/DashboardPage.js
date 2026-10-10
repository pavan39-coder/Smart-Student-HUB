import React, { useEffect, useState } from 'react';
import { userService, activityService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Student Dashboard Page
 */
const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          userService.getStats(),
          activityService.getMyActivities(),
        ]);
        setStats(statsRes.data.data);
        setActivities(activitiesRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const chartData = [
    { name: 'Approved', value: stats?.approvedActivities || 0 },
    { name: 'Pending', value: stats?.pendingActivities || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Points</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.points || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Your Rank</h3>
          <p className="text-3xl font-bold text-green-600">#{stats?.rank || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved Activities</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.approvedActivities || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Activities</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.pendingActivities || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity._id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.type}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${activity.status === 'approved' ? 'bg-green-100 text-green-800' : activity.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
