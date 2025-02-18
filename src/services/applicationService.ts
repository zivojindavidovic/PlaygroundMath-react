import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { Application, ResolveApplicationRequest } from '../types/application';

export class ApplicationService {
  static async getApplications(userId: string): Promise<Application[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.APPLICATIONS}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return await response.json();
  }

  static async resolveApplication(data: ResolveApplicationRequest): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.RESOLVE_APPLICATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to resolve application');
    }
  }
} 