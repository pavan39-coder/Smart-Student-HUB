import React, { useEffect, useState } from 'react';
import { activityService } from '../services/authService';
import ActivityCard from '../components/ActivityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { ACTIVITY_TYPES } from '../utils/constants';
import { FiPlus, FiFilter } from 'react-icons/fi';

/**
 * Activities Page
 */
const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    description: '',
    certificate: null,
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activityService.getMyActivities(filters);
        setActivities(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [filters]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('date', formData.date);
      data.append('description', formData.description);
      if (formData.certificate) {
        data.append('certificate', formData.certificate);
      }

      await activityService.addActivity(data);
      setSuccess('Activity added successfully!');
      setShowAddForm(false);
      setFormData({ title: '', type: '', date: '', description: '', certificate: null });

      // Refresh activities
      const response = await activityService.getMyActivities(filters);
      setActivities(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add activity');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.deleteActivity(id);
        setSuccess('Activity deleted successfully!');
        const response = await activityService.getMyActivities(filters);
        setActivities(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete activity');
      }
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Activities</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus /> Add Activity
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Activity</h2>
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Activity Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                required
              >
                <option value="">Select Activity Type</option>
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              rows="4"
              required
            />

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Upload Certificate (optional)</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, certificate: e.target.files[0] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Add Activity
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex items-center gap-4">
        <FiFilter className="text-gray-600" />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="">All Types</option>
          {ACTIVITY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} onDelete={handleDeleteActivity} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No activities yet. Start adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
