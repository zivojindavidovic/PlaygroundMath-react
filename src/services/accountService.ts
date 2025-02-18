import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { CreateAccountData, CreateAccountResponse } from '../types/account';

export class AccountService {
  static async createAccount(data: CreateAccountData): Promise<CreateAccountResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  }
} 