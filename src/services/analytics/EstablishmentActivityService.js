import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentActivityService = {
  async getActiveUsers(establishmentId, period = 'week') {
    // Mock implementation for structure
    return {
      today: 120,
      week: 450,
      month: 890,
      trend: '+5%'
    };
  },
  async getNewUsersCount(establishmentId, period) {
    return 45;
  },
  async getInactiveUsers(establishmentId) {
    return [{ id: 1, name: 'Jean', lastActive: '2023-01-01' }];
  },
  async getActivityRate(establishmentId) {
    return 68; // percentage
  },
  async getRecentActivityTimeline(establishmentId) {
    return [
      { time: '10:00', active: 150 },
      { time: '11:00', active: 200 }
    ];
  },
  async getActivityByDayOfWeek(establishmentId) {
    return [
      { day: 'Lun', value: 80 },
      { day: 'Mar', value: 95 }
    ];
  },
  async getActivityHeatmap(establishmentId) {
    return []; // Heatmap data structure
  },
  async getUserActivityHistory(establishmentId, userId) {
    return [];
  }
};