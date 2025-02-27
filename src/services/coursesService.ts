import { API_BASE_URL } from '../api/constants';
import { ChildCoursesResponse, TestsResponse } from '../types/courses';
import { ProfessorCourseResponse } from '../types/professorCourse';

export class CoursesService {
  static async getChildCourses(userId: string): Promise<ChildCoursesResponse> {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/user/accounts/courses?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch child courses');
    }

    const data = await response.json();
    return data;
  }

  static async getAccountTests(accountId: number, courseId: number): Promise<TestsResponse> {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/user/accounts/${accountId}/tests?courseId=${courseId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tests');
    }

    const data = await response.json();
    return data;
  }

  static async getProfessorCourse(userId: string, courseId: string): Promise<ProfessorCourseResponse> {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/user/teachers/${userId}/courses/${courseId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch professor course');
    }

    const data = await response.json();
    return data;
  }
} 