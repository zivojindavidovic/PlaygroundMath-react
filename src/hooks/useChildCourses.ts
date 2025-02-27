import { useState, useEffect } from 'react';
import { CoursesService } from '../services/coursesService';
import { AccountCourses } from '../types/courses';

export const useChildCourses = (userId: string) => {
  const [accounts, setAccounts] = useState<AccountCourses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildCourses = async () => {
      try {
        setIsLoading(true);
        const response = await CoursesService.getChildCourses(userId);
        setAccounts(response.accounts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildCourses();
  }, [userId]);

  return { accounts, isLoading, error };
}; 