import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { CoursesResponse } from '../types/course';

export class CourseService {
  static async getMyCourses(): Promise<CoursesResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.MY_COURSES}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return await response.json();
  }
}