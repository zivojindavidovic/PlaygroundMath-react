import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { RankListResponse } from '../types/rank';

export class RankService {
  static async getRankList(): Promise<RankListResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.RANK_LIST}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rank list');
    }
    
    const data = await response.json();
    return data;
  }
} 