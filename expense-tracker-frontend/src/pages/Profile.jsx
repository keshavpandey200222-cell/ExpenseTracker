import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Profile.css';

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            setProfile(response.data);
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <><Navbar /><div className="page"><div className="container">Loading...</div></div></>;

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Profile</h1>
                    </div>

                    <div className="profile-content">
                        <div className="profile-card">
                            <div className="profile-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2>{user?.name}</h2>
                            <p className="profile-email">{user?.email}</p>
                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <div className="stat-value">Member since</div>
                                    <div className="stat-label">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-info-card">
                            <h3>Account Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Full Name</div>
                                    <div className="info-value">{user?.name}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Email Address</div>
                                    <div className="info-value">{user?.email}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Account Type</div>
                                    <div className="info-value">Personal</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Status</div>
                                    <div className="info-value">
                                        <span className="status-badge">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button className="btn btn-secondary">Edit Profile</button>
                                <button className="btn btn-secondary">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
