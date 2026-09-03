import api from './api';
import { DailyWaterSummary, WaterHistoryDay, LogWaterDTO, UpdateWaterGoalDTO } from '../types/water';

export const getWaterSummary = async (date?: string): Promise<DailyWaterSummary> => {
  const response = await api.get('/water/summary', { params: { date } });
  return response.data.data;
};

export const logWaterIntake = async (dto: LogWaterDTO): Promise<DailyWaterSummary> => {
  const response = await api.post('/water/log', dto);
  return response.data.data;
};

export const deleteWaterIntake = async (intakeId: string, date?: string): Promise<DailyWaterSummary> => {
  const response = await api.delete(`/water/log/${intakeId}`, { params: { date } });
  return response.data.data;
};

export const updateWaterGoal = async (dto: UpdateWaterGoalDTO): Promise<DailyWaterSummary> => {
  const response = await api.put('/water/goal', dto);
  return response.data.data;
};

export const getWaterHistory = async (days: number = 7): Promise<WaterHistoryDay[]> => {
  const response = await api.get('/water/history', { params: { days } });
  return response.data.data;
};
