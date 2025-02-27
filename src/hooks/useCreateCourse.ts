import { useState } from 'react';
import { CourseService } from '../services/courseService';
import { toast } from 'react-toastify';

export const useCreateCourse = () => {
  const [age, setAge] = useState(5);
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCourse = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedDueDate = new Date(dueDate).toISOString().split(".")[0];
      
      const response = await CourseService.createCourse({
        userId,
        age,
        dueDate: formattedDueDate,
        title,
        description
      });

      if (response.success) {
        toast.success('Kurs je uspešno kreiran');
        setAge(5);
        setDueDate('');
      } else {
        throw new Error('Failed to create course');
      }
    } catch (err) {
      const errorMessage = 'Error creating course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    age,
    dueDate,
    isLoading,
    error,
    title,
    description,
    setAge,
    setDueDate,
    setTitle,
    setDescription,
    handleCreateCourse
  };
}; 