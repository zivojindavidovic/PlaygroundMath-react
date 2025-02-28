import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { ProfessorsResponse } from '../types/professor';
import { ProfessorCourse, Account, CourseApplication } from '../types/professor';

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

  static async getProfessorCourses(teacherId: string): Promise<ProfessorCourse[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.ALL}?professorId=${teacherId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return await response.json();
  }

  static async getUserAccounts(userId: string, courseId: number): Promise<Account[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.GET_ALL_FOR_APPLICATION}?userId=${userId}&courseId=${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    
    const data = await response.json();
    return data.success && data.results && data.results.length > 0 ? data.results[0].accounts : [];
  }

  static async applyCourse(application: CourseApplication): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.APPLY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(application),
    });
    
    if (!response.ok) {
      throw new Error('Failed to apply for course');
    }
  }
} 