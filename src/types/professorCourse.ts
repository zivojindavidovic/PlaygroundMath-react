export interface CourseAccount {
  accountId: number;
  username: string;
  solvedTest: number;
}

export interface CourseTask {
  taskId: number;
  task: string;
}

export interface CourseTest {
  testId: number;
  isCompleted: boolean;
  tasks: CourseTask[];
}

export interface ProfessorCourseResponse {
  courseId: number;
  totalTests: number;
  isExpired: boolean;
  accounts: CourseAccount[];
  tests: CourseTest[];
} 