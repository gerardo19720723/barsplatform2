import axios from 'axios';

// 1. Configuración base
export const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Define tu Token aquí
const JUAN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5wZXJlekBsYWNhbnRpbmEuY29tIiwic3ViIjoiY21sa3BvbjMzMDAwM2pkcm81Y2F0NGYyaiIsInJvbGUiOiJPV05FUiIsInRlbmFudElkIjoiY21sa3BsOTFkMDAwMWpkcm9nOGthdDY5aiIsImlhdCI6MTc3MTA5Njk2MiwiZXhwIjoxNzcxMTgzMzYyfQ.WApMJoAiV5RBlvEoKKSBhDlQqFhr8xh5iudw67-VtKM"; 

// 3. Interceptor: Esto añade el token a TODAS las peticiones
api.interceptors.request.use((config) => {
  // Aquí ES DONDE se usa JUAN_TOKEN (por eso TypeScript se quejaba si faltaba esta línea)
  config.headers.Authorization = `Bearer ${JUAN_TOKEN}`;
  return config;
});