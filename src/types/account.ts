export interface CreateAccountData {
  username: string;
  age: number;
}

export interface CreateAccountResponse {
  success: boolean;
  errors?: {
    username?: string;
    age?: string;
  }[];
} 

export interface Account {
  accountId: number;
  username: string;
  points: number;
}

export interface AccountsResponse {
  success: boolean;
  results?: [{
    accounts: Account[];
  }];
  errors?: Record<string, string>[];
}