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

export interface CreateCourseData {
  userId: string;
  age: number;
  dueDate: string;
}

export interface CreateCourseResponse {
  success: boolean;
  errors?: Record<string, string>[];
}