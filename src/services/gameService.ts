import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { 
  ApiResponse, 
  TaskResult, 
  Course, 
  UnresolvedTestsResponse,
  GenerateTasksRequest,
  SolveTaskRequest
} from '../types/game';

export class GameService {
  static async generateTasks(data: GenerateTasksRequest): Promise<ApiResponse<TaskResult>> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TASK.GENERATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate tasks');
    }
    
    return await response.json();
  }

  static async solveTasks(data: SolveTaskRequest): Promise<{ pointsFromTest: number; totalPoints: number }> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TASK.SOLVE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to solve tasks');
    }
    
    const result = await response.json();
    
    return {
      pointsFromTest: result.results[0].pointsFromTest,
      totalPoints: result.results[0].totalPoints
    };
  }

  static async getUnresolvedTasks(accountId: string): Promise<ApiResponse<TaskResult>> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TASK.UNRESOLVED}?accountId=${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch unresolved tasks');
    }
    
    return await response.json();
  }

  static async getCourses(accountId: string): Promise<Course[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COURSE.ALL}?accountId=${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return await response.json();
  }

  static async getUnresolvedTests(accountId: string, courseId: number): Promise<UnresolvedTestsResponse[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.TASK.UNRESOLVED}?accountId=${accountId}&courseId=${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch unresolved tests');
    }
    
    return await response.json();
  }
} 