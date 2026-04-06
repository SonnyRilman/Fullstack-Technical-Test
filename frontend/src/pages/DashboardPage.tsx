import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import SalesCharts from '../components/SalesCharts';
import SalesTable from '../components/SalesTable';
import PredictForm from '../components/PredictForm';
import { salesApi } from '../api';
import type { SalesItem, SalesStats } from '../types';
import { RefreshCw, BarChart3, Table2, Brain } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [sales, setSales]       = useState<SalesItem[]>([]);
  const [stats, setStats]       = useState<SalesStats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage]   = useState(0);
  const [refreshing, setRefreshing]     = useState(false);
  const PAGE_SIZE = 50;

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [salesData, statsData] = await Promise.all([
        salesApi.getAll({ limit: PAGE_SIZE, offset: currentPage * PAGE_SIZE, status: filterStatus || undefined }),
        salesApi.getStats(),
      ]);
      setSales(salesData);
      setStats(statsData);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Gagal memuat data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, filterStatus]);

  useEffect(() => { 
    if (isAuthenticated) fetchData(); 
  }, [fetchData, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tabMeta: Record<string, { icon: React.ReactNode; title: string; subtitle: string }> = {
    overview: { icon: <BarChart3 size={16} />, title: 'Overview Dashboard', subtitle: 'Ringkasan data & visualisasi penjualan produk' },
    data:     { icon: <Table2 size={16} />,    title: 'Data Penjualan',     subtitle: `${stats?.total_products?.toLocaleString('id-ID') ?? '...'} produk dalam dataset` },
    predict:  { icon: <Brain size={16} />,     title: 'Prediksi ML',        subtitle: 'Klasifikasi status produk dengan Random Forest' },
  };

  const current = tabMeta[activeTab];

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); }} />

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-title">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {current.icon} {current.title}
            </h2>
            <p>{current.subtitle}</p>
          </div>
          <div className="topbar-actions">
            {activeTab !== 'predict' && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => fetchData(true)}
                disabled={refreshing}
                id="refresh-btn"
                title="Refresh data"
              >
                <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
                {refreshing ? 'Memuat...' : 'Refresh'}
              </button>
            )}
          </div>
        </header>

        <main className="page-content">
          {error && (
            <div className="alert alert-error mb-6" role="alert">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="fade-up">
              <StatsCards stats={stats} loading={loading} />
              {!loading && stats && <SalesCharts stats={stats} sales={sales} />}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="fade-up">
              <SalesTable
                sales={sales}
                loading={loading}
                filterStatus={filterStatus}
                onFilterChange={(v: string) => { setFilterStatus(v); setCurrentPage(0); }}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalStats={stats}
              />
            </div>
          )}

          {activeTab === 'predict' && (
            <div className="fade-up">
              <PredictForm />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
