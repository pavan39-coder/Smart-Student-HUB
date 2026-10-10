import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { FiSearch, FiUser } from 'react-icons/fi';

/**
 * Admin Students Page
 */
const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [studentsRes, facultyRes] = await Promise.all([
        adminService.getAllStudents(search),
        adminService.getFaculty(),
      ]);

      setStudents(studentsRes.data.data);
      setFaculties(facultyRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students/faculty');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignFaculty = async (studentId, facultyId) => {
    if (!facultyId) {
      setError('Please select a faculty to assign.');
      return;
    }

    try {
      await adminService.assignFaculty(studentId, facultyId);
      setSuccess('Faculty assigned to student successfully.');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign faculty');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Manage Students</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Search */}
      <div className="mb-8 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Supervisor</th>
                <th className="px-6 py-3 text-right">Points</th>
                <th className="px-6 py-3 text-center">Portfolio</th>
                <th className="px-6 py-3 text-center">Assign</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {student.supervisor ? student.supervisor.name : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{student.points}</td>
                  <td className="px-6 py-4 text-center">
                    {student.isPublic ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Public</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">Private</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col gap-2">
                      <select
                        defaultValue={student.supervisor?._id || ''}
                        onChange={(e) => handleAssignFaculty(student._id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="">Assign faculty</option>
                        {faculties.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No students found</p>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
