import axios from 'axios';

const API_BASE = 'https://movies-app-ten-flame.vercel.app/api/movies';

export async function fetchMovies(page = 1, limit = 10) {
  const res = await axios.get(`${API_BASE}?page=${page}&limit=${limit}`);
  return res.data;
}

export async function createMovie(data: FormData) {
  const res = await axios.post(API_BASE, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateMovie(id: string, data: FormData) {
  const res = await axios.put(`${API_BASE}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteMovie(id: string) {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}
