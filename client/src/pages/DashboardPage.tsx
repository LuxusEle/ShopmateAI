import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingInvoices: number;
  totalRevenue: number;
  teamSize: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    teamSize: 0,
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      setUser(JSON.parse(userData));
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all stats in parallel
        const [projectsRes, tasksRes, invoicesRes, staffRes] = await Promise.all([
          apiClient.getProjects({ limit: 1 }),
          apiClient.getTasks({ limit: 1 }),
          apiClient.getInvoices({ limit: 1 }),
          apiClient.getStaff({ limit: 1 }),
        ]);

        // Calculate stats from responses
        const projectStats = await apiClient.getProjectStats();
        const taskStats = await apiClient.getTaskStats();
        const invoiceStats = await apiClient.getInvoiceStats();

        setStats({
          totalProjects: projectsRes.pagination?.total || 0,
          activeProjects: projectStats.data?.active || 0,
          totalTasks: tasksRes.pagination?.total || 0,
          completedTasks: taskStats.data?.completed || 0,
          pendingInvoices: invoiceStats.data?.byStatus?.sent || 0,
          totalRevenue: invoiceStats.data?.totalRevenue || 0,
          teamSize: staffRes.pagination?.total || 0,
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Token expired - try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshRes = await apiClient.refreshToken(refreshToken);
              localStorage.setItem('accessToken', refreshRes.data.accessToken);
              apiClient.setAuthHeader(refreshRes.data.accessToken);
              // Retry fetching data
              fetchDashboardData();
            } catch {
              navigate('/login');
            }
          }
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 ShopMate AI Dashboard</h1>
          <p>Welcome back, {user.email}!</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/settings')} className="btn-secondary">
            ⚙️ Settings
          </button>
          <button onClick={handleLogout} className="btn-danger">
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && <div className="dashboard-error">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="dashboard-loading">Loading dashboard data...</div>
      ) : (
        <main className="dashboard-main">
          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Total Projects</h3>
                <p className="stat-value">{stats.totalProjects}</p>
                <p className="stat-detail">{stats.activeProjects} active</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Tasks Completed</h3>
                <p className="stat-value">{stats.completedTasks}</p>
                <p className="stat-detail">Out of {stats.totalTasks}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${(stats.totalRevenue / 100).toFixed(2)}</p>
                <p className="stat-detail">{stats.pendingInvoices} pending</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Team Members</h3>
                <p className="stat-value">{stats.teamSize}</p>
                <p className="stat-detail">Active staff</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button
                onClick={() => navigate('/projects')}
                className="action-button"
              >
                <span className="action-icon">📁</span>
                <span>View Projects</span>
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="action-button"
              >
                <span className="action-icon">📌</span>
                <span>Manage Tasks</span>
              </button>
              <button
                onClick={() => navigate('/invoices')}
                className="action-button"
              >
                <span className="action-icon">📄</span>
                <span>View Invoices</span>
              </button>
              <button
                onClick={() => navigate('/contacts')}
                className="action-button"
              >
                <span className="action-icon">👤</span>
                <span>Manage Contacts</span>
              </button>
              <button
                onClick={() => navigate('/staff')}
                className="action-button"
              >
                <span className="action-icon">👔</span>
                <span>Team Management</span>
              </button>
              <button
                onClick={() => navigate('/ai-assistant')}
                className="action-button"
              >
                <span className="action-icon">🤖</span>
                <span>AI Assistant</span>
              </button>
            </div>
          </section>

          {/* AI Brief */}
          <section className="ai-brief">
            <h2>🤖 Daily AI Brief</h2>
            <div className="brief-card">
              <p>Good morning! Here's your AI-generated brief:</p>
              <ul>
                <li>✨ {stats.activeProjects} active projects need attention</li>
                <li>⏰ {Math.max(0, stats.totalTasks - stats.completedTasks)} tasks pending completion</li>
                <li>💳 {stats.pendingInvoices} invoices awaiting payment</li>
                <li>👥 Your team is operating at {stats.teamSize > 0 ? '100%' : '0%'} capacity</li>
              </ul>
              <p className="brief-footer">
                💡 <strong>Recommendation:</strong> Focus on high-priority tasks this week to improve completion rate.
              </p>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
