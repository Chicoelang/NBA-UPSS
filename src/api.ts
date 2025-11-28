import axios from 'axios';
import type { Team, Player, Standing, BoxScore } from './types';

const api = axios.create({
  baseURL: 'https://api-nba-ups.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// --- TEAMS ---
export const getTeams = async () => {
  const response = await api.get<Team[]>('/teams');
  return response.data;
};

// --- STANDINGS ---
export const getStandings = async () => {
  const response = await api.get<Standing[]>('/standings');
  return response.data;
};

export const createStanding = async (data: Omit<Standing, 'id' | 'teams'>) => {
  const response = await api.post<Standing>('/standings', data);
  return response.data;
};

export const updateStanding = async (id: string, data: Partial<Omit<Standing, 'id' | 'teams'>>) => {
  const response = await api.put<Standing>(`/standings/${id}`, data);
  return response.data;
};

export const deleteStanding = async (id: string) => {
  const response = await api.delete(`/standings/${id}`);
  return response.data;
};

// --- PLAYERS ---
export const getPlayers = async () => {
  const response = await api.get<Player[]>('/players');
  return response.data;
};

// --- BOX SCORES ---
export const getBoxScores = async () => {
  const response = await api.get<BoxScore[]>('/box-scores');
  return response.data;
};

export const createBoxScore = async (data: Omit<BoxScore, 'id' | 'players'>) => {
  const response = await api.post<BoxScore>('/box-scores', data);
  return response.data;
};

export const updateBoxScore = async (id: string, data: Partial<Omit<BoxScore, 'id' | 'players'>>) => {
  const response = await api.put<BoxScore>(`/box-scores/${id}`, data);
  return response.data;
};

export const deleteBoxScore = async (id: string) => {
  const response = await api.delete(`/box-scores/${id}`);
  return response.data;
};