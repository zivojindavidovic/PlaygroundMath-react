import { useState, useEffect } from 'react';
import { Course } from '../types/course';
import { CourseService } from '../services/courseService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useProfessorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await CourseService.getMyCourses();
      if (data.success && data.results) {
        setCourses(data.results);
      } else {
        throw new Error('No courses found');
      }
    } catch (err) {
      const errorMessage = 'Failed to load courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/professor-courses/${courseId}`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, isLoading, error, handleCourseClick };
}; 