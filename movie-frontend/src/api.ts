import axios from 'axios';
import type { Movie } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


export async function fetchMovies(page = 1, limit = 10) {
  const res = await axios.get(`${API_BASE}/api/movies`, { params: { page, limit } });
  return res.data;
}

export async function createMovie(payload: Movie) {
  const res = await axios.post(`${API_BASE}/api/movies`, payload);
  return res.data;
}

export async function updateMovie(id: string, payload: Movie) {
  const res = await axios.put(`${API_BASE}/api/movies/${id}`, payload);
  return res.data;
}

export async function deleteMovie(id: string) {
  const res = await axios.delete(`${API_BASE}/api/movies/${id}`);
  return res.data;
}
