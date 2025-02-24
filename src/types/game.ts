export interface OnlineTask {
  taskId: number;
  task: string;
}

export interface ApiResponse<T> {
  success: boolean;
  errors: string[];
  results: T[];
}

export interface TaskResult {
  type: "pdf" | "online";
  tasks: string[] | OnlineTask[];
}

export interface Course {
  courseId: number;
  courseAge: number;
}

export interface TestTask {
  taskId: number;
  task: string;
}

export interface UnresolvedTest {
  testId: number;
  tasks: TestTask[];
}

export interface UnresolvedTestsResponse {
  courseId: number;
  tests: UnresolvedTest[];
}

export interface GenerateTasksRequest {
  numberOneFrom: number;
  numberOneTo: number;
  numberTwoFrom: number;
  numberTwoTo: number;
  testType: "online" | "pdf";
  accountId: number;
  operations: string[];
  sumUnitsGoesOverCurrentTenSum: boolean;
  sumExceedTwoDigitsSum: boolean;
  allowedNegativeResultsSub: boolean;
  allowedBiggerUnitsInSecondNumberSub: boolean;
  allowedThreeDigitsResultMul: boolean;
}

export interface SolveTaskRequest {
  testAnswers: Record<string, string>[];
  accountId: number;
  testId?: number;
}

export interface OperationConfig {
  [key: string]: number;
}

export interface AccountDetails {
  accountId: number;
  username: string;
  points: number;
}

export interface CourseListItem {
  courseId: number;
  courseAge: number;
}

export interface UnresolvedTask {
  taskId: number;
  task: string;
}

export interface UnresolvedTestItem {
  testId: number;
  tasks: UnresolvedTask[];
}

export interface UnresolvedTestResponse {
  courseId: number;
  tests: UnresolvedTestItem[];
}