import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CoursesService } from '../services/coursesService';
import { ProfessorCourseResponse } from '../types/professorCourse';

export const useProfessorCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const userId = localStorage.getItem('userId') || '';
  const [courseData, setCourseData] = useState<ProfessorCourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = async () => {
    if (!courseId || !userId) return;

    try {
      setIsLoading(true);
      const response = await CoursesService.getProfessorCourse(userId, courseId);
      setCourseData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, userId]);

  return { courseData, isLoading, error, refreshCourseData: fetchCourseData };
}; 