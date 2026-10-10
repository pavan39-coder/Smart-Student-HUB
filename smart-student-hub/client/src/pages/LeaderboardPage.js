import React, { useEffect, useState } from 'react';
import { leaderboardService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FiAward, FiUser } from 'react-icons/fi';

/**
 * Leaderboard Page
 */
const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardService.getLeaderboard(20, page * 20);
        setLeaderboard(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [page]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FiAward className="text-yellow-500" size={32} /> Leaderboard
      </h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((student) => (
                <tr key={student._id} className={`border-b hover:bg-blue-50 transition-colors ${student.rank <= 3 ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 text-gray-800">
                    {student.rank === 1 && <span className="text-2xl">🥇</span>}
                    {student.rank === 2 && <span className="text-2xl">🥈</span>}
                    {student.rank === 3 && <span className="text-2xl">🥉</span>}
                    {student.rank > 3 && <span className="font-bold text-gray-700">{student.rank}</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-800 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600 text-lg">{student.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-800 font-semibold py-2">Page {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
