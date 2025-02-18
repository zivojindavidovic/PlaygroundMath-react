export interface Professor {
  teacherId: number;
  teacherEmail: string;
  numberOfActiveCourses: number;
}

export type ProfessorsResponse = Professor[];

export interface ProfessorCourse {
  courseId: number;
  age: number;
  dueDate: string;
}

export interface Account {
  accountId: number;
  username: string;
  points: number;
}

export interface CourseApplication {
  courseId: number;
  accountId: number;
} 