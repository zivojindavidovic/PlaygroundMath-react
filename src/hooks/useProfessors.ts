import { useState, useEffect } from 'react';
import { Professor } from '../types/professor';
import { ProfessorService } from '../services/professorService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useProfessors = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isTeacher = localStorage.getItem("isTeacher") === "true";

  const fetchProfessors = async () => {
    if (isTeacher) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProfessorService.getProfessors();
      setProfessors(data);
    } catch (err) {
      const errorMessage = 'Failed to load professors';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessorClick = (teacherId: number) => {
    navigate(`/professors/${teacherId}`);
  };

  useEffect(() => {
    fetchProfessors();
  }, [isTeacher]);

  return { professors, isLoading, error, handleProfessorClick };
}; 