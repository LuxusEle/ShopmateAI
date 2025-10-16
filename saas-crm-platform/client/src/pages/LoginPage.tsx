import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIClient } from '../services/api';
import '../styles/Auth.css';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organizationName: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!loginForm.email || !loginForm.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await APIClient.login({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (response.success) {
        // Store tokens and user info
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('organizationId', response.data.organizationId);
        localStorage.setItem(
          'user',
          JSON.stringify({
            staffId: response.data.staffId,
            email: response.data.email,
            role: response.data.role,
          })
        );

        // Set default header
        APIClient.setAuthHeader(response.data.accessToken);

        // Clear form
        setLoginForm({ email: '', password: '' });

        // Callback or navigate
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!registerForm.email || !registerForm.password || !registerForm.fullName || !registerForm.organizationName) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (registerForm.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await APIClient.register({
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName,
        organizationName: registerForm.organizationName,
      });

      if (response.success) {
        // Store tokens and user info
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('organizationId', response.data.organizationId);
        localStorage.setItem(
          'user',
          JSON.stringify({
            staffId: response.data.staffId,
            email: response.data.email,
            role: response.data.role,
          })
        );

        // Set default header
        APIClient.setAuthHeader(response.data.accessToken);

        // Clear form
        setRegisterForm({ email: '', password: '', confirmPassword: '', fullName: '', organizationName: '' });

        // Navigate to dashboard
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ShopMate AI</h1>
          <p>Manufacturing & Service Automation Platform</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Welcome Back</h2>

            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="auth-link"
                >
                  Create one
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Create Your Account</h2>

            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-org">Organization Name</label>
              <input
                id="register-org"
                type="text"
                name="organizationName"
                placeholder="Your Company Inc."
                value={registerForm.organizationName}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={registerForm.email}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm">Confirm Password</label>
              <input
                id="register-confirm"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="auth-link"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        <div className="auth-demo">
          <p>Demo Credentials (if database seeded):</p>
          <code>
            Email: demo@shopmate.com
            <br />
            Password: Demo123!
          </code>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
