import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { CoursesResponse, CreateCourseData, CreateCourseResponse } from '../types/course';

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

  static async createCourse(data: CreateCourseData): Promise<CreateCourseResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    if (!response.ok && response.status !== 400) {
      throw new Error('Failed to create course');
    }
    
    return responseData;
  }
}