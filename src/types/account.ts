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