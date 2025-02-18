export interface Account {
  accountId: number;
  username: string;
  points: number;
}

export interface DeleteUserRequest {
  userId: string;
  password: string;
}

export interface DeleteAccountRequest {
  accountId: number;
  userPassword: string;
}

export interface AccountsResponse {
  success: boolean;
  results?: [{
    accounts: Account[];
  }];
  errors?: Record<string, string>[];
}

export interface DeleteResponse {
  success: boolean;
  errors?: Record<string, string>[];
} 