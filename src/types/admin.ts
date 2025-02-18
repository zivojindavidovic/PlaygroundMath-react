export interface AdminUser {
  id: number;
  email: string;
  isParent: boolean;
  isTeacher: boolean;
}

export interface AdminAccount {
  accountId: number;
  username: string;
  points: number;
}

export interface UpdatePointsRequest {
  points: number;
} 