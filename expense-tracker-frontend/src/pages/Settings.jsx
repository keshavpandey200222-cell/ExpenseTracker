import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './Settings.css';

function Settings() {
    const { theme } = useTheme();
    const [settings, setSettings] = useState({
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        notifications: true,
        emailAlerts: false,
        budgetAlerts: true
    });

    const handleSave = () => {
        // Save settings logic
        alert('Settings saved!');
    };

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Settings</h1>
                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                    </div>

                    <div className="settings-grid">
                        <div className="settings-section">
                            <h3>Appearance</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Theme</div>
                                    <div className="setting-desc">Choose your preferred color scheme</div>
                                </div>
                                <div className="setting-control">
                                    <span className="theme-badge">{theme === 'light' ? 'Light' : 'Dark'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3>Regional Settings</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Currency</div>
                                    <div className="setting-desc">Default currency for transactions</div>
                                </div>
                                <div className="setting-control">
                                    <select className="form-input" value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
                                        <option value="INR">₹ INR - Indian Rupee</option>
                                        <option value="USD">$ USD - US Dollar</option>
                                        <option value="EUR">€ EUR - Euro</option>
                                        <option value="GBP">£ GBP - British Pound</option>
                                    </select>
                                </div>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Date Format</div>
                                    <div className="setting-desc">How dates are displayed</div>
                                </div>
                                <div className="setting-control">
                                    <select className="form-input" value={settings.dateFormat} onChange={e => setSettings({ ...settings, dateFormat: e.target.value })}>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3>Notifications</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Push Notifications</div>
                                    <div className="setting-desc">Receive notifications in the app</div>
                                </div>
                                <div className="setting-control">
                                    <label className="toggle">
                                        <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({ ...settings, notifications: e.target.checked })} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Email Alerts</div>
                                    <div className="setting-desc">Get email updates about your expenses</div>
                                </div>
                                <div className="setting-control">
                                    <label className="toggle">
                                        <input type="checkbox" checked={settings.emailAlerts} onChange={e => setSettings({ ...settings, emailAlerts: e.target.checked })} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Budget Alerts</div>
                                    <div className="setting-desc">Notify when approaching budget limits</div>
                                </div>
                                <div className="setting-control">
                                    <label className="toggle">
                                        <input type="checkbox" checked={settings.budgetAlerts} onChange={e => setSettings({ ...settings, budgetAlerts: e.target.checked })} />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section danger-zone">
                            <h3>Danger Zone</h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <div className="setting-label">Delete Account</div>
                                    <div className="setting-desc">Permanently delete your account and all data</div>
                                </div>
                                <div className="setting-control">
                                    <button className="btn btn-danger">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;
