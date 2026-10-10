import React, { useEffect, useState } from 'react';
import { adminService, integrationService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';

/**
 * Admin Dashboard Page
 */
const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [integrationProviders, setIntegrationProviders] = useState([]);
  const [integrationLoading, setIntegrationLoading] = useState(true);
  const [exportStudentId, setExportStudentId] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('lms');
  const [pushLoading, setPushLoading] = useState(false);
  const [pushResult, setPushResult] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    const fetchIntegrationProviders = async () => {
      try {
        const response = await integrationService.getProviders();
        setIntegrationProviders(response.data.data.supportedProviders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load integration support info');
      } finally {
        setIntegrationLoading(false);
      }
    };

    fetchStats();
    fetchIntegrationProviders();
  }, []);

  const handleDownloadNAACReport = async () => {
    try {
      setReportLoading(true);
      const response = await adminService.getNAACReport();
      const blob = new Blob([JSON.stringify(response.data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `naac_report_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download NAAC report');
    } finally {
      setReportLoading(false);
    }
  };

  const handleExportStudentData = async () => {
    if (!exportStudentId) {
      setError('Student ID is required to export data.');
      return;
    }

    try {
      const response = await integrationService.exportStudentData(exportStudentId, true);
      const blob = new Blob([JSON.stringify(response.data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_export_${exportStudentId}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setPushResult(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export student data');
    }
  };

  const handlePushIntegration = async () => {
    if (!selectedProvider || !exportStudentId || !targetUrl) {
      setError('Provider, student ID, and target URL are required for sync.');
      return;
    }

    try {
      setPushLoading(true);
      setPushResult(null);
      const response = await integrationService.pushIntegrationData({
        provider: selectedProvider,
        studentId: exportStudentId,
        targetUrl,
        apiKey,
        includeAllActivities: true,
      });
      setPushResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to push integration data');
    } finally {
      setPushLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const activityChartData = [
    { name: 'Approved', value: stats?.approvedActivities || 0 },
    { name: 'Pending', value: stats?.pendingActivities || 0 },
    { name: 'Rejected', value: stats?.rejectedActivities || 0 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleDownloadNAACReport}
          disabled={reportLoading}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {reportLoading ? 'Preparing Report...' : 'Download NAAC Report'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalStudents || 0}</p>
            </div>
            <FiUsers className="text-blue-600 opacity-20" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Activities</h3>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalActivities || 0}</p>
            </div>
            <FiClock className="text-purple-600 opacity-20" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Approval</h3>
              <p className="text-3xl font-bold text-orange-600">{stats?.pendingActivities || 0}</p>
            </div>
            <FiCheckCircle className="text-orange-600 opacity-20" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-600">{stats?.approvedActivities || 0}</p>
            </div>
            <FiCheckCircle className="text-green-600 opacity-20" size={48} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Integration Support</h3>
            <p className="text-gray-600">Provides LMS/ERP connector scaffolding and provider metadata for future integrations.</p>
          </div>
          <span className="text-sm font-semibold text-indigo-700">
            {integrationLoading ? 'Loading...' : `${integrationProviders.length} providers available`}
          </span>
        </div>

        {!integrationLoading && integrationProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {integrationProviders.map((provider) => (
              <div key={provider.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                <p className="text-gray-600 text-sm mt-2">{provider.description}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3">Export Student Data</h4>
            <input
              type="text"
              value={exportStudentId}
              onChange={(e) => setExportStudentId(e.target.value)}
              placeholder="Student ID"
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={handleExportStudentData}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export Student JSON
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3">Push to LMS / ERP</h4>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            >
              {integrationProviders.map((provider) => (
                <option key={provider.key} value={provider.key}>
                  {provider.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Target API URL"
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key (optional)"
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={handlePushIntegration}
              disabled={pushLoading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {pushLoading ? 'Syncing...' : 'Push Data'}
            </button>
          </div>
        </div>

        {pushResult && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <div className="font-semibold mb-2">Connector Response</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(pushResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {activityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top 10 Students</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats?.topStudents?.map((student, index) => (
              <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600">#{index + 1}</span>
                  <span className="font-semibold text-gray-800">{student.name}</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{student.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
