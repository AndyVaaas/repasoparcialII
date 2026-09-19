import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/vehiculos',
});

export default api;