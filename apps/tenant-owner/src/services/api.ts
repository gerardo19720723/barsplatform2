import axios from 'axios';

// 1. Configuración base
export const api = axios.create({
  baseURL: 'http://localhost:3001', // Tu Backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para inyectar el Token automáticamente
// (Por ahora, pegaremos el token manualmente para probar rápido)
const JUAN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5wZXJlekBsYWNhbnRpbmEuY29tIiwic3ViIjoiY21sa3BvbjMzMDAwM2pkcm81Y2F0NGYyaiIsInJvbGUiOiJPV05FUiIsInRlbmFudElkIjoiY21sa3BsOTFkMDAwMWpkcm9nOGthdDY5aiIsImlhdCI6MTc3MDk3NjY2OCwiZXhwIjoxNzcxMDYzMDY4fQ.R4tqiC_phEFUnWuLz3bzdSYRyqqQLXEmS86wZFNgUuE"; 

api.interceptors.request.use((config) => {
  // Si el token existe, lo agregamos al header
  if (JUAN_TOKEN && JUAN_TOKEN !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5wZXJlekBsYWNhbnRpbmEuY29tIiwic3ViIjoiY21sa3BvbjMzMDAwM2pkcm81Y2F0NGYyaiIsInJvbGUiOiJPV05FUiIsInRlbmFudElkIjoiY21sa3BsOTFkMDAwMWpkcm9nOGthdDY5aiIsImlhdCI6MTc3MDk3NjY2OCwiZXhwIjoxNzcxMDYzMDY4fQ.R4tqiC_phEFUnWuLz3bzdSYRyqqQLXEmS86wZFNgUuE") {
    config.headers.Authorization = `Bearer ${JUAN_TOKEN}`;
  }
  return config;
});