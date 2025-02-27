import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../services/authService';
import { RegisterCredentials } from '../types/auth';

export const useRegister = () => {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async ({ email, password, accountType, firstName, lastName }: RegisterCredentials) => {
    setEmailError('');
    setPasswordError('');
    setIsLoading(true);
    
    try {
      const data = await AuthService.register({ email, password, accountType, firstName, lastName });
      
      if (data.success) {
        toast.success('Registracija je uspela. Proveri svoju e-adresu kako bi potvrdio kreiranje naloga.', 
          { autoClose: 2000 }
        );
        setTimeout(() => navigate('/login'), 2000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((errObj: Record<string, string>) => {
            if (errObj.email) setEmailError(errObj.email);
            if (errObj.password) setPasswordError(errObj.password);
          });
        }
      }
    } catch (error) {
      toast.error('Registracija nije uspela. Pokušaj ponovo kasnije.', {
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { register, emailError, passwordError, isLoading, setPasswordError };
}; 