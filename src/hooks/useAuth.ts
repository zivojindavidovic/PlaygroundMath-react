import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../services/authService';
import { storage } from '../utils/storage';
import { LoginCredentials } from '../types/auth';

export const useAuth = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    setError('');
    setIsLoading(true);
    
    try {
      const data = await AuthService.login(credentials);
      
      if (!data.success) {
        const errorMessages = data.errors && data.errors.length > 0
          ? data.errors.map(errObj => Object.values(errObj)[0]).join(', ')
          : 'Login failed';
        throw new Error(errorMessages);
      }

      const result = data.results?.[0];
      if (result) {
        storage.setAuthData(result);
        toast.success('Prijavio si se uspešno');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
}; 