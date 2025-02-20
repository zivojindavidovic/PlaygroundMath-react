import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { 
  ApiResponse, 
  TaskResult, 
  Course, 
  UnresolvedTestsResponse,
  GenerateTasksRequest,
  SolveTaskRequest,
  OperationConfig,
  AccountDetails
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

  static async getOperationConfig(): Promise<OperationConfig> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONFIG.GET}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch operation config');
    }
    
    return await response.json();
  }
  
  static async getAccountDetails(accountId: string): Promise<AccountDetails> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.GET}?accountId=${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch account details');
    }
    
    return await response.json();
  }

  static async generateTasksForCourse(data: Omit<GenerateTasksRequest, 'accountId'> & { courseId: number }): Promise<ApiResponse<TaskResult>> {
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
} 