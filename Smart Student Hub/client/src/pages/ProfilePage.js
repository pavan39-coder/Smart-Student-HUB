import React, { useEffect, useState } from 'react';
import { userService, portfolioService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { FiEdit2, FiGlobe } from 'react-icons/fi';

/**
 * Profile Page
 */
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
    socialLinks: { github: '', linkedin: '', portfolio: '' },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name,
          bio: response.data.data.bio || '',
          skills: response.data.data.skills || [],
          socialLinks: response.data.data.socialLinks || {},
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setProfile(response.data.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleTogglePortfolio = async () => {
    try {
      const response = await userService.togglePortfolioVisibility();
      setProfile(response.data.data);
      setSuccess(`Portfolio is now ${response.data.data.isPublic ? 'public' : 'private'}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle portfolio visibility');
    }
  };

  const handleDownloadPortfolioPDF = async () => {
    if (!profile?.portfolioId) return;

    try {
      setDownloadingPDF(true);
      const response = await portfolioService.downloadPortfolioPDF(profile.portfolioId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download portfolio PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

        {!editing ? (
          // View Mode
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>

            {profile?.bio && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}

            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Social Links</h3>
                <div className="space-y-2">
                  {profile.socialLinks.github && (
                    <p>
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        GitHub
                      </a>
                    </p>
                  )}
                  {profile.socialLinks.linkedin && (
                    <p>
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiGlobe /> Portfolio Visibility
                </h3>
                <span className={`px-3 py-1 rounded-full font-semibold ${profile?.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {profile?.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {profile?.isPublic
                  ? `Your portfolio is public. Share this link: ${window.location.origin}/portfolio/${profile?.portfolioId}`
                  : 'Your portfolio is private. Only you can see it.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTogglePortfolio}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {profile?.isPublic ? 'Make Private' : 'Make Public'}
                </button>
                {profile?.isPublic && (
                  <button
                    onClick={handleDownloadPortfolioPDF}
                    disabled={downloadingPDF}
                    className="bg-white text-blue-700 px-6 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {downloadingPDF ? 'Downloading...' : 'Download Portfolio PDF'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map((s) => s.trim()) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">GitHub Link</label>
              <input
                type="url"
                value={formData.socialLinks.github || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">LinkedIn Link</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
