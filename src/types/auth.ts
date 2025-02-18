export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  errors?: Record<string, string>[];
  results?: [{
    accessToken: string;
    userId: string;
    email: string;
    isTeacher: boolean;
  }];
} 