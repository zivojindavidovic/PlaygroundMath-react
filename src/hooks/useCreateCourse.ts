import { useState } from 'react';
import { CourseService } from '../services/courseService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FieldErrors {
  title?: string;
  description?: string;
}

export const useCreateCourse = () => {
  const [age, setAge] = useState(5);
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

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
    setFieldErrors({});

    try {
      const formattedDueDate = new Date(dueDate).toISOString().split(".")[0];
      
      console.log('Sending request with data:', {
        userId,
        age,
        dueDate: formattedDueDate,
        title,
        description
      });
      
      const response = await CourseService.createCourse({
        userId,
        age,
        dueDate: formattedDueDate,
        title,
        description
      });

      console.log('Received response:', response);

      if (response.success) {
        toast.success('Kurs je uspešno kreiran');
        setAge(5);
        setDueDate('');
        setTitle('');
        setDescription('');
        navigate('/professor-courses');
      } else if (response.errors) {
        console.log('Processing errors:', response.errors);
        const newErrors: FieldErrors = {};
        response.errors.forEach(error => {
          console.log('Processing error:', error);
          if ('title' in error) newErrors.title = error.title;
          if ('description' in error) newErrors.description = error.description;
        });
        console.log('Setting field errors to:', newErrors);
        setFieldErrors(newErrors);
      }
    } catch (err) {
      console.error('Error in handleCreateCourse:', err);
      toast.error('Error creating course');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    age,
    dueDate,
    isLoading,
    fieldErrors,
    title,
    description,
    setAge,
    setDueDate,
    setTitle,
    setDescription,
    handleCreateCourse
  };
}; 