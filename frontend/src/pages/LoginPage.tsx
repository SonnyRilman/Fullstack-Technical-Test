import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import {
  BarChart3, Lock, User, Eye, EyeOff, AlertCircle,
  Shield, Info, LayoutDashboard, Brain, BarChart2
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.login({ username, password });
      login(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Username atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard Penjualan', desc: 'Pantau performa produk secara real-time' },
    { icon: <Brain size={20} />,           label: 'Prediksi ML',        desc: 'Machine Learning untuk klasifikasi produk' },
    { icon: <BarChart2 size={20} />,       label: 'Analisis Visual',    desc: 'Chart interaktif distribusi & tren' },
  ];

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="login-left-content">
          <div className="login-logo-wrap">
            <BarChart3 size={36} />
          </div>

          <h1 className="login-hero-title">SalesPredix</h1>
          <p className="login-hero-desc">
            Sistem prediksi penjualan berbasis Machine Learning yang membantu Anda mengidentifikasi
            produk Laris dan Tidak Laris secara akurat.
          </p>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{f.label}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: 2 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            Powered by Random Forest · FastAPI · React TypeScript
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}>
                <BarChart3 size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--indigo-400)', letterSpacing: '0.05em' }}>
                SALESPREDIX
              </span>
            </div>
            <h2>Masuk ke Dashboard</h2>
            <p>Gunakan akun Anda untuk mengakses sistem prediksi Machine Learning</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-inner">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-wrapper">
                <User size={15} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password" className="form-label">Password</label>
              </div>
              <div className="input-wrapper">
                <Lock size={15} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label="Tampilkan/sembunyikan password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              id="login-submit-btn"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Memverifikasi...
                </span>
              ) : (
                <>
                  <Shield size={16} />
                  Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="login-cred-box" style={{ marginTop: '1.25rem' }}>
            <Info size={16} className="cred-icon" />
            <div className="cred-list">
              <span style={{ marginBottom: 4, fontSize: '0.78rem', fontWeight: 600 }}>Demo Credentials:</span>
              <span>Username: <code>admin</code></span>
              <span>Password: <code>admin123</code></span>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Mini Machine Learning Sales Prediction System · Fullstack Technical Test
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
