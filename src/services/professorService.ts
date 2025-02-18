import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { ProfessorsResponse } from '../types/professor';

export class ProfessorService {
  static async getProfessors(): Promise<ProfessorsResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER.TEACHERS}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch professors');
    }
    
    return await response.json();
  }
} 