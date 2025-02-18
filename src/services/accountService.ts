import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { AccountsResponse, CreateAccountData, CreateAccountResponse } from '../types/account';

export class AccountService {
  static async getAccounts(userId: string): Promise<AccountsResponse> {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACCOUNT.GET_ALL}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return await response.json();
  }

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