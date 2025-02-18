export interface Course {
  courseId: number;
  age: number;
  dueDate: string;
}

export interface CoursesResponse {
  success: boolean;
  results?: Course[];
  errors?: Record<string, string>[];
} 