import React, { useState } from 'react';
import { mlApi } from '../api';
import type { PredictRequest, PredictResponse } from '../types';
import { 
  Brain, TrendingUp, TrendingDown, Loader2, Zap, 
  BarChart2, Package, Banknote, Percent
} from 'lucide-react';

const fmtCur = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const PredictForm: React.FC = () => {
  const [form, setForm] = useState<PredictRequest>({ jumlah_penjualan: 150, harga: 75000, diskon: 10 });
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof PredictRequest, val: string) =>
    setForm((p) => ({ ...p, [field]: parseFloat(val) || 0 }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await mlApi.predict(form);
      setResult(res);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Gagal melakukan prediksi.');
    } finally {
      setLoading(false);
    }
  };

  const isLaris = result?.status_prediksi === 'Laris';

  const getTip = (res: PredictResponse) => {
    if (res.status_prediksi === 'Laris') {
      return 'Produk ini diprediksi memiliki performa penjualan yang baik. Pertimbangkan untuk meningkatkan stok dan promosi.';
    }
    if (res.input_data.jumlah_penjualan < 100) {
      return 'Jumlah penjualan rendah menjadi faktor utama. Coba tingkatkan kuantitas atau berikan strategi promosi lebih agresif.';
    }
    return 'Produk ini diprediksi kurang laris. Pertimbangkan penyesuaian harga atau strategi diskon yang lebih menarik.';
  };

  return (
    <div className="predict-layout">
      {/* Input Section */}
      <div className="predict-form-card">
        <div className="predict-form-header">
          <div className="predict-form-header-top">
            <div className="predict-header-icon">
              <Brain size={22} />
            </div>
            <div>
              <div className="predict-header-title">Prediksi Status Produk</div>
              <div className="predict-header-sub">Model: Random Forest Classifier</div>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.6 }}>
            Masukkan data produk di bawah ini. Model Machine Learning akan memprediksi apakah produk tersebut
            termasuk <strong style={{ color: 'var(--green)' }}>Laris</strong> atau{' '}
            <strong style={{ color: 'var(--red-light)' }}>Tidak Laris</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="predict-form-body">
          {error && (
            <div className="alert alert-error" style={{ fontSize: '0.8rem' }}>
              <BarChart2 size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Jumlah Penjualan */}
          <div className="input-card">
            <div className="input-card-label">
              <div className="input-card-label-left">
                <Package size={15} className="input-field-icon" /> Jumlah Penjualan
              </div>
              <span className="input-card-label-right">unit terjual</span>
            </div>
            <input
              id="jumlah_penjualan"
              type="number"
              min={0}
              step={1}
              value={form.jumlah_penjualan}
              onChange={(e) => set('jumlah_penjualan', e.target.value)}
              placeholder="contoh: 150"
              required
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Rekomendasi laris: &gt; 100 unit
            </div>
          </div>

          {/* Harga */}
          <div className="input-card">
            <div className="input-card-label">
              <div className="input-card-label-left">
                <Banknote size={15} className="input-field-icon" /> Harga Satuan
              </div>
              <span className="input-card-label-right">IDR per item</span>
            </div>
            <input
              id="harga"
              type="number"
              min={1}
              step={1}
              value={form.harga}
              onChange={(e) => set('harga', e.target.value)}
              placeholder="contoh: 75000"
              required
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Nilai sekarang: {fmtCur(form.harga)}
            </div>
          </div>

          {/* Diskon */}
          <div className="input-card">
            <div className="input-card-label">
              <div className="input-card-label-left">
                <Percent size={15} className="input-field-icon" /> Diskon
              </div>
              <span className="input-card-label-right">
                <strong style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{form.diskon}%</strong>
              </span>
            </div>

            {/* Slider */}
            <input
              id="diskon-slider"
              type="range"
              min={0}
              max={30}
              step={5}
              value={form.diskon}
              onChange={(e) => set('diskon', e.target.value)}
              style={{
                '--range-pct': `${(form.diskon / 30) * 100}%`,
              } as React.CSSProperties}
              aria-label="Diskon slider"
            />
            <div className="range-labels">
              {[0, 5, 10, 15, 20, 25, 30].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('diskon', String(v))}
                  style={{
                    background: form.diskon === v ? 'var(--indigo-500)' : 'rgba(255,255,255,0.06)',
                    color: form.diskon === v ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 5,
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <button
            id="predict-submit-btn"
            type="submit"
            className="predict-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain size={18} />
                Prediksi Sekarang
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="predict-result-area">
        {!result && !loading && (
          <div className="result-empty-state">
            <div className="result-empty-icon">
              <Brain size={28} />
            </div>
            <div className="result-empty-title">Belum ada prediksi</div>
            <div className="result-empty-desc">
              Isi form di sebelah kiri dan klik <strong>"Prediksi Sekarang"</strong> untuk mendapatkan
              analisis status produk dari model Machine Learning.
            </div>
          </div>
        )}

        {loading && (
          <div className="result-empty-state">
            <div className="result-empty-icon">
              <Loader2 size={28} className="spin" />
            </div>
            <div className="result-empty-title">Model sedang berpikir...</div>
            <div className="result-empty-desc">Memproses data dengan Random Forest Classifier...</div>
          </div>
        )}

        {result && !loading && (
          <>
            {/* Main result card */}
            <div className={`result-card result-card-${isLaris ? 'laris' : 'tidak'}`} id="predict-result">
              {/* Header */}
              <div className="result-card-header">
                <div className={`result-big-icon rbi-${isLaris ? 'laris' : 'tidak'}`}>
                  {isLaris ? <TrendingUp size={30} /> : <TrendingDown size={30} />}
                </div>
                <div className="result-header-text">
                  <div className="result-header-label">Hasil Prediksi ML</div>
                  <div className={`result-status-text result-${isLaris ? 'laris' : 'tidak'}-text`}>
                    {isLaris ? '✓ LARIS' : '✗ TIDAK LARIS'}
                  </div>
                  <div className="result-confidence-inline">
                    Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="result-card-body">
                {/* Confidence bar */}
                <div className="confidence-block">
                  <div className="confidence-row">
                    <span className="confidence-label">Confidence Score</span>
                    <span className="confidence-pct">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="confidence-track">
                    <div
                      className={`confidence-fill cf-${isLaris ? 'laris' : 'tidak'}`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Probability comparison */}
                <div className="prob-compare">
                  <div className="prob-col">
                    <span className="prob-col-label">P(Laris)</span>
                    <span className={`prob-col-pct pct-laris`}>
                      {(result.probability_laris * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="prob-vs">vs</span>
                  <div className="prob-col">
                    <span className="prob-col-label">P(Tidak)</span>
                    <span className={`prob-col-pct pct-tidak`}>
                      {(result.probability_tidak * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Input summary */}
                <div className="result-input-summary">
                  <div className="ris-title">Detail Input</div>
                  {[
                    { key: 'Jumlah Penjualan', val: `${result.input_data.jumlah_penjualan.toLocaleString('id-ID')} unit` },
                    { key: 'Harga Satuan',     val: fmtCur(result.input_data.harga) },
                    { key: 'Diskon',           val: `${result.input_data.diskon}%` },
                  ].map((row) => (
                    <div key={row.key} className="ris-row">
                      <span className="ris-row-key">{row.key}</span>
                      <span className="ris-row-val">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips card */}
            <div className="result-tips-card">
              <Zap size={18} className="tips-icon" />
              <div>
                <div className="tips-title">Saran & Rekomendasi</div>
                <div className="tips-text">{getTip(result)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PredictForm;
