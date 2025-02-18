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

export interface RegisterCredentials {
  email: string;
  password: string;
  accountType: 'PARENT' | 'TEACHER';
}

export interface RegisterResponse {
  success: boolean;
  errors?: Record<string, string>[];
}