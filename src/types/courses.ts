export interface ChildCourse {
  courseId: number;
  courseTestsCount: number;
  accountSolvedTestsCount: number;
}

export interface AccountCourses {
  accountId: number;
  username: string;
  courses: ChildCourse[];
}

export interface ChildCoursesResponse {
  accounts: AccountCourses[];
}

export interface Task {
  taskId: number;
  task: string;
}

export interface Test {
  testId: number;
  isCompleted: boolean;
  tasks: Task[];
}

export interface TestsResponse {
  tests: Test[];
} 