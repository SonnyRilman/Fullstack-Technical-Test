import React from 'react';
import type { SalesItem, SalesStats } from '../types';
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';

interface Props {
  sales: SalesItem[];
  loading: boolean;
  filterStatus: string;
  onFilterChange: (v: string) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  pageSize: number;
  totalStats: SalesStats | null;
}

const fmtCur = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const SalesTable: React.FC<Props> = ({
  sales, loading, filterStatus, onFilterChange,
  currentPage, onPageChange, pageSize, totalStats,
}) => {
  return (
    <div className="table-container fade-up" style={{ animationDelay: '0.2s' }}>
      {/* Search & Filter */}
      <div className="table-toolbar" style={{ padding: '1.25rem 1.5rem', background: '#fff' }}>
        <div className="toolbar-left">
          <div className="toolbar-title-box">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Data Produk</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {loading ? 'Memuat...' : `${sales.length} item ditampilkan`}
            </span>
          </div>
          
          {totalStats && !loading && (
            <div className="toolbar-stat-badges" style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
              <div className="status-pill status-pill-success">
                <span className="status-dot"></span>
                Laris: {totalStats.laris.toLocaleString('id-ID')}
              </div>
              <div className="status-pill status-pill-danger">
                <span className="status-dot"></span>
                Tidak: {totalStats.tidak.toLocaleString('id-ID')}
              </div>
            </div>
          )}
        </div>

        <div className="toolbar-right" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-input-box" style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              style={{ 
                padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.82rem', borderRadius: 20,
                border: '1px solid var(--border)', background: 'var(--bg-base)', width: 180, outline: 'none'
              }} 
              disabled
            />
          </div>
          <div className="filter-select-box" style={{ position: 'relative' }}>
            <Filter size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <select
              className="filter-select-styled"
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              style={{ 
                padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.82rem', borderRadius: 20,
                border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', outline: 'none',
                appearance: 'none', minWidth: 140
              }}
            >
              <option value="">Semua Status</option>
              <option value="Laris">Laris</option>
              <option value="Tidak">Tidak Laris</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Product ID</th>
              <th>Nama Produk</th>
              <th className="text-right">Jml. Penjualan</th>
              <th className="text-right">Harga Satuan</th>
              <th className="text-center">Diskon</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, r) => (
                <tr key={r}>
                  {[...Array(7)].map((_, c) => (
                    <td key={c}><div className="skeleton skeleton-text" style={{ height: 20 }} /></td>
                  ))}
                </tr>
              ))
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-subtle)' }}>
                  <Search size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Tidak ada data penjualan ditemukan</p>
                </td>
              </tr>
            ) : (
              sales.map((item, idx) => (
                <tr key={item.product_id} className="table-row-hover">
                  <td style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {currentPage * pageSize + idx + 1}
                  </td>
                  <td style={{ width: 120 }}>
                    <code className="product-id-tag">{item.product_id}</code>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.product_name}</span>
                  </td>
                  <td className="text-right" style={{ fontWeight: 700 }}>
                    {item.jumlah_penjualan.toLocaleString('id-ID')}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: 4 }}>unit</span>
                  </td>
                  <td className="text-right" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    {fmtCur(item.harga)}
                  </td>
                  <td className="text-center">
                    <span className="discount-pill">
                      {item.diskon}%
                    </span>
                  </td>
                  <td className="text-center">
                    <div className={`status-badge ${item.status === 'Laris' ? 'sb-laris' : 'sb-tidak'}`}>
                      {item.status === 'Laris' ? 'Laris' : 'Tidak Laris'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-footer" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Halaman <strong style={{ color: 'var(--text-primary)' }}>{currentPage + 1}</strong>
          <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
          Menampilkan {sales.length} data
        </div>
        <div className="pagination-nav" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="p-nav-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="p-nav-current">{currentPage + 1}</div>
          <button
            className="p-nav-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={sales.length < pageSize}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;
