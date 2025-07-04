import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadResume, getUserResumes, deleteResume } from '../../services/api';
import useAuthStore from '../../store/authStore';
import { showSuccessNotification, showErrorNotification } from '../../services/api'; // Assuming you added notification helpers here

const UserProfilePage: React.FC = () => {
  // Placeholder state for user data and resumes
  const [user, setUser] = useState({
    id: '', // Assuming user ID is part of the profile
    username: '',
    email: '',
    // Add other profile fields as needed
  });
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for fetching user data and resumes
  useEffect(() => {
    const fetchProfileAndResumes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming user ID is available in authStore after login
        const userId = useAuthStore.getState().id;
        if (!userId) {
          setError('User ID not found. Please log in.');
          setLoading(false);
          return;
        }
        const profileData = await getUserProfile(userId);
        setUser(profileData);
        const userResumes = await getUserResumes(userId);
        setResumes(userResumes);
      } catch (err) {
        setError('Failed to load profile or resumes.');
        console.error(err);
        showErrorNotification('Failed to load profile or resumes.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndResumes();
  }, []);

  // Placeholder for handling profile updates
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(user.id, user)
      .then(() => showSuccessNotification('Profile updated successfully!'))
      .catch(() => showErrorNotification('Failed to update profile.'));
  };

  // Placeholder for handling resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Use File type
    // Implementation of uploadResume and updating state will be needed
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {/* Profile Information Section */}
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate}>
          {/* Placeholder form fields */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-accent-500"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-accent-500"
              value={user.email}
              // Email might not be editable, keeping it disabled for now
              disabled
            />
          </div>
           <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-accent-500"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled // Email might not be editable
            />
          </div>
          {/* Add other profile fields here */}
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-primary-600 rounded hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-500"
            className="px-4 py-2 font-semibold text-white bg-accent-500 rounded hover:bg-accent-600 focus:outline-none focus:ring focus:ring-accent-500"
          >
            Update Profile
          </button>
        </form>
      </section>
      )}
      {/* Resume Management Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Resume Management</h2>
        <div className="mb-4">
          <label htmlFor="resumeUpload" className="block text-gray-700 font-semibold mb-2">Upload New Resume</label>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Resumes</h3>
          {resumes.length === 0 ? (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {resumes.map((resume) => {
                // Placeholder for resume management. In a real app, you'd fetch real resume data.
                const handleDeleteResume = () => {
                  deleteResume(user.id, resume.id)
                    .then(() => {
                      setResumes(resumes.filter(r => r.id !== resume.id));
                      showSuccessNotification('Resume deleted successfully!');
                    })
                    .catch(() => showErrorNotification('Failed to delete resume.'));
                };
                return (
                <li key={resume.id} className="flex items-center justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-800">{resume.name}</span>
                  <button onClick={handleDeleteResume} className="text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300 rounded-md p-1">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserProfilePage;