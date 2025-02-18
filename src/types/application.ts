export interface Application {
  courseId: number;
  courseAge: number;
  accountId: number;
  accountAge: number;
  accountUsername: string;
}

export interface ResolveApplicationRequest {
  courseId: number;
  accountId: number;
  decision: boolean;
} 