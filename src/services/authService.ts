import { API_BASE_URL, ENDPOINTS } from '../api/constants';
import { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    return data;
  }

  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    return data;
  }
} 