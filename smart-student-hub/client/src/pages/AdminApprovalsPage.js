import React, { useEffect, useState } from 'react';
import { adminService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const BACKEND_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '') : '';
const getFileUrl = (path) => (path?.startsWith('http') ? path : `${BACKEND_BASE_URL}${path}`);

/**
 * Admin Approvals Page
 */
const AdminApprovalsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [approveForm, setApproveForm] = useState({ activityId: null, points: '', adminNotes: '' });
  const [rejectForm, setRejectForm] = useState({ activityId: null, rejectionReason: '' });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminService.getPendingActivities();
        setActivities(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!approveForm.activityId || !approveForm.points) {
      setError('Please fill all fields');
      return;
    }

    try {
      await adminService.approveActivity(approveForm.activityId, {
        points: parseInt(approveForm.points),
        adminNotes: approveForm.adminNotes,
      });
      setSuccess('Activity approved successfully!');
      setActivities(activities.filter((a) => a._id !== approveForm.activityId));
      setApproveForm({ activityId: null, points: '', adminNotes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve activity');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectForm.activityId || !rejectForm.rejectionReason) {
      setError('Please fill all fields');
      return;
    }

    try {
      await adminService.rejectActivity(rejectForm.activityId, {
        rejectionReason: rejectForm.rejectionReason,
      });
      setSuccess('Activity rejected successfully!');
      setActivities(activities.filter((a) => a._id !== rejectForm.activityId));
      setRejectForm({ activityId: null, rejectionReason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject activity');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Pending Approvals</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No pending activities</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Details */}
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 mb-2">Student: {activity.studentId?.name}</p>
                  <p className="text-gray-600 mb-2">Email: {activity.studentId?.email}</p>
                  <p className="text-gray-600 mb-2">Type: {activity.type}</p>
                  <p className="text-gray-700 mt-4">{activity.description}</p>
                  {activity.certificate && (
                    <p className="text-blue-600 mt-4">
                      📄 <a href={getFileUrl(activity.certificate.filePath)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Certificate
                      </a>
                    </p>
                  )}
                  {activity.status === 'faculty_approved' && (
                    <p className="text-indigo-600 mt-2 font-medium">Faculty verified. Awaiting admin final approval.</p>
                  )}
                  {activity.recommendedPoints != null && (
                    <p className="text-indigo-600 mt-2">Faculty recommended points: {activity.recommendedPoints}</p>
                  )}
                </div>

                {/* Action Forms */}
                <div className="space-y-4">
                  {approveForm.activityId === activity._id ? (
                    <form onSubmit={handleApprove} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-gray-800 mb-3">Approve Activity</h4>
                      <input
                        type="number"
                        min="0"
                        placeholder="Points"
                        value={approveForm.points}
                        onChange={(e) => setApproveForm({ ...approveForm, points: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-green-600"
                      />
                      <textarea
                        placeholder="Admin notes (optional)"
                        value={approveForm.adminNotes}
                        onChange={(e) => setApproveForm({ ...approveForm, adminNotes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-green-600"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setApproveForm({ activityId: null, points: '', adminNotes: '' })}
                          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setApproveForm({ activityId: activity._id, points: '', adminNotes: '' })}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Approve
                    </button>
                  )}

                  {rejectForm.activityId === activity._id ? (
                    <form onSubmit={handleReject} className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-bold text-gray-800 mb-3">Reject Activity</h4>
                      <textarea
                        placeholder="Rejection reason"
                        value={rejectForm.rejectionReason}
                        onChange={(e) => setRejectForm({ ...rejectForm, rejectionReason: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-600"
                        rows="2"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectForm({ activityId: null, rejectionReason: '' })}
                          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setRejectForm({ activityId: activity._id, rejectionReason: '' })}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;
