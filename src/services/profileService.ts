import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { AccountsResponse, DeleteResponse, DeleteUserRequest, DeleteAccountRequest } from '../types/profile';

export class ProfileService {
  static async getAccounts(userId: string): Promise<AccountsResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.GET_ALL}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return await response.json();
  }

  static async deleteUser(data: DeleteUserRequest): Promise<DeleteResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER.DELETE}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  }

  static async deleteAccount(data: DeleteAccountRequest): Promise<DeleteResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.DELETE}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  }
} 