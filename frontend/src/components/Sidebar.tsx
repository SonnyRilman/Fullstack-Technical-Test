import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  BarChart3, LayoutDashboard, Table2, Brain,
  LogOut, ChevronRight, FileText, ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { username, fullName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (fullName || username || 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { id: 'overview', label: 'Overview',        icon: <LayoutDashboard size={17} />, desc: 'Ringkasan & Charts' },
    { id: 'data',     label: 'Data Penjualan',  icon: <Table2 size={17} />,          desc: 'Tabel produk' },
    { id: 'predict',  label: 'Prediksi ML',     icon: <Brain size={17} />,           desc: 'Analisis produk baru' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <BarChart3 size={20} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-app-name">SalesPredix</span>
          <span className="sidebar-tagline">ML Prediction</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu Utama</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: activeTab === item.id ? 600 : 500 }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: 1 }}>
                {item.desc}
              </div>
            </div>
            {activeTab === item.id && (
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            )}
          </button>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-soft)', margin: '0.75rem 0' }} />

        {/* API doc link */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="nav-item"
        >
          <span className="nav-icon"><FileText size={17} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem' }}>API Docs</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: 1 }}>Swagger UI</div>
          </div>
          <ExternalLink size={12} style={{ opacity: 0.4 }} />
        </a>
      </nav>

      {/* Footer user */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{fullName || username}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            id="logout-btn"
            title="Keluar"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
