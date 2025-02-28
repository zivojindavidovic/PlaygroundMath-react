import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { AdminUser, AdminAccount, UpdatePointsRequest } from '../types/admin';

interface UpdatePointsData {
    accountId: number;
    points: number;
    username: string;
}

interface UpdateUserData {
  userId: number;
  firstName: string;
  lastName: string;
}

export class AdminService {
  static async getUsers(): Promise<AdminUser[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.USERS}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  }

  static async getAccounts(): Promise<AdminAccount[]> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.ACCOUNTS}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    
    return await response.json();
  }

  static async deleteUser(userId: number): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.DELETEUSER}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  static async updatePoints(data: UpdatePointsData): Promise<{ success: boolean }> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.UPDATEPOINTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update points');
    }
    
    return await response.json();
  }

  static async deleteAccount(accountId: number): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.DELETEACCOUNT}?accountId=${accountId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  }

  static async updateUser(data: UpdateUserData): Promise<{ success: boolean }> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN.UPDATEUSER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return await response.json();
  }
} 