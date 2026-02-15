import axios from 'axios';

// NOTA: Para probar rápido, usaremos el token de Juan.
// En un futuro, crearías un usuario con rol 'STAFF' y usarías su token.
const STAFF_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5wZXJlekBsYWNhbnRpbmEuY29tIiwic3ViIjoiY21sa3BvbjMzMDAwM2pkcm81Y2F0NGYyaiIsInJvbGUiOiJPV05FUiIsInRlbmFudElkIjoiY21sa3BsOTFkMDAwMWpkcm9nOGthdDY5aiIsImlhdCI6MTc3MTE0MTU3NCwiZXhwIjoxNzcxMjI3OTc0fQ.sAmiFlZVrM6hP0a3Ebo0GuujoVTOF_B619SFzUGLhxs"; 

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (STAFF_TOKEN) {
    config.headers.Authorization = `Bearer ${STAFF_TOKEN}`;
  }
  return config;
});