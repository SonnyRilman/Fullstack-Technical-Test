import React from 'react';
import type { SalesStats } from '../types';
import { Package, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Props {
  stats: SalesStats | null;
  loading: boolean;
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const fmtNum = (n: number) => n.toLocaleString('id-ID');

const StatsCards: React.FC<Props> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card skeleton" style={{ minHeight: 130 }} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      id: 'stat-total',
      key: 'blue',
      label: 'Total Produk',
      value: fmtNum(stats.total_products),
      icon: <Package size={20} />,
      iconClass: 'si-blue',
      meta: 'Dalam dataset',
      metaClass: '',
    },
    {
      id: 'stat-laris',
      key: 'green',
      label: 'Produk Laris',
      value: fmtNum(stats.laris),
      icon: <TrendingUp size={20} />,
      iconClass: 'si-green',
      meta: `${stats.laris_pct}% dari total`,
      metaClass: 'stat-meta-good',
    },
    {
      id: 'stat-tidak',
      key: 'red',
      label: 'Tidak Laris',
      value: fmtNum(stats.tidak),
      icon: <TrendingDown size={20} />,
      iconClass: 'si-red',
      meta: `${stats.tidak_pct}% dari total`,
      metaClass: 'stat-meta-bad',
    },
    {
      id: 'stat-revenue',
      key: 'purple',
      label: 'Est. Revenue',
      value: fmtCurrency(stats.total_revenue),
      icon: <DollarSign size={20} />,
      iconClass: 'si-purple',
      meta: 'Total pendapatan estimasi',
      metaClass: '',
    },
  ] as const;

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.id} id={card.id} className={`stat-card stat-card-${card.key}`}>
          <div className="stat-card-top">
            <span className="stat-label">{card.label}</span>
            <div className={`stat-icon-box ${card.iconClass}`}>{card.icon}</div>
          </div>
          <div className="stat-value">{card.value}</div>
          <div className={`stat-meta ${card.metaClass}`}>
            {card.meta}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
