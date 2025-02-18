export interface Professor {
  teacherId: number;
  teacherEmail: string;
  numberOfActiveCourses: number;
}

export type ProfessorsResponse = Professor[]; 