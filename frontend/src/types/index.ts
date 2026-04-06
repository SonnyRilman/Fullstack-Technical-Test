export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  username: string;
  full_name: string;
}

export interface SalesItem {
  product_id: string;
  product_name: string;
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
  status: 'Laris' | 'Tidak';
}

export interface SalesStats {
  total_products: number;
  laris: number;
  tidak: number;
  laris_pct: number;
  tidak_pct: number;
  avg_jumlah_penjualan: number;
  avg_harga: number;
  avg_diskon: number;
  total_revenue: number;
}

export interface PredictRequest {
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
}

export interface PredictResponse {
  status_prediksi: 'Laris' | 'Tidak';
  confidence: number;
  probability_laris: number;
  probability_tidak: number;
  input_data: PredictRequest;
}

export interface AuthState {
  token: string | null;
  username: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
}
