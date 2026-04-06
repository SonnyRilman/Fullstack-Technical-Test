import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { Package, Banknote, Percent } from 'lucide-react';
import type { SalesStats, SalesItem } from '../types';

interface Props {
  stats: SalesStats;
  sales: SalesItem[];
}

const PIE_COLORS     = ['#FF7043', '#EF5350'];
const TOOLTIP_STYLE  = {
  background  : '#ffffff',
  border      : '1px solid #FFF3E0',
  borderRadius: 12,
  fontSize    : '0.82rem',
  boxShadow   : '0 8px 24px rgba(61, 44, 44, 0.08)',
  color: '#3D2C2C'
};

const fmtNum = (n: number) => n.toLocaleString('id-ID');
const fmtCur = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0, notation: 'compact' }).format(n);

const SalesCharts: React.FC<Props> = ({ stats, sales }) => {
  const pieData = [
    { name: 'Laris',       value: stats.laris },
    { name: 'Tidak Laris', value: stats.tidak  },
  ];

  const buckets: Record<string, { laris: number; tidak: number }> = {};
  [0, 5, 10, 15, 20, 25, 30].forEach((d) => { buckets[`${d}%`] = { laris: 0, tidak: 0 }; });
  sales.forEach((item) => {
    const key = `${item.diskon}%`;
    if (buckets[key]) {
      if (item.status === 'Laris') buckets[key].laris++;
      else buckets[key].tidak++;
    }
  });
  const barData = Object.entries(buckets).map(([diskon, v]) => ({
    diskon, Laris: v.laris, Tidak: v.tidak,
  }));

  return (
    <>
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribusi Status Produk</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [fmtNum(v), 'Jumlah']} />
            </PieChart>
          </ResponsiveContainer>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            {pieData.map((entry, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i] }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)' }}>{entry.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmtNum(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Status per Tingkat Diskon</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="diskon" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={TOOLTIP_STYLE} 
                itemStyle={{ fontSize: 12 }} 
                cursor={{ fill: '#FFF8F5' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 15 }} />
              <Bar dataKey="Laris" fill="#FF7043" radius={[4, 4, 0, 0]} maxBarSize={25} />
              <Bar dataKey="Tidak" fill="#EF5350" radius={[4, 4, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="summary-row" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          {
            icon: <Package size={18} />, bg: '#f0f9ff', color: '#0369a1', label: 'Rata-rata Penjualan',
            value: `${stats.avg_jumlah_penjualan.toLocaleString('id-ID')} unit`,
          },
          {
            icon: <Banknote size={18} />, bg: '#fffbeb', color: '#92400e', label: 'Rata-rata Harga',
            value: fmtCur(stats.avg_harga),
          },
          {
            icon: <Percent size={18} />, bg: '#f0fdf4', color: '#166534', label: 'Rata-rata Diskon',
            value: `${stats.avg_diskon}%`,
          },
        ].map((tile, i) => (
          <div key={i} className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: 12, background: tile.bg, color: tile.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {tile.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 2 }}>{tile.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tile.value}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SalesCharts;
