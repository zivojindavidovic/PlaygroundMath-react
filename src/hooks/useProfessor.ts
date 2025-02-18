import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProfessorCourse, Account } from '../types/professor';
import { ProfessorService } from '../services/professorService';
import { toast } from 'react-toastify';

export const useProfessor = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [courses, setCourses] = useState<ProfessorCourse[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    if (!teacherId) {
      toast.error('Teacher ID not found');
      return;
    }

    setIsLoading(true);
    console.log('Fetching courses for teacher:', teacherId); // Debug log

    try {
      const data = await ProfessorService.getProfessorCourses(teacherId);
      console.log('Received courses:', data); // Debug log
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error); // Debug log
      toast.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowModal(true);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    try {
      const accounts = await ProfessorService.getUserAccounts(userId);
      setAccounts(accounts);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    }
  };

  const handleSendApplication = async () => {
    if (!selectedCourseId || !selectedAccountId) {
      toast.error('Please select an account');
      return;
    }

    try {
      await ProfessorService.applyCourse({
        courseId: selectedCourseId,
        accountId: selectedAccountId,
      });
      toast.success('Application sent successfully');
      setShowModal(false);
      setSelectedAccountId('');
    } catch (error) {
      toast.error('Failed to send application');
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with teacherId:', teacherId); // Debug log
    fetchCourses();
  }, [teacherId]);

  return {
    courses,
    accounts,
    showModal,
    isLoading,
    selectedAccountId,
    setShowModal,
    setSelectedAccountId,
    handleApply,
    handleSendApplication,
  };
}; 