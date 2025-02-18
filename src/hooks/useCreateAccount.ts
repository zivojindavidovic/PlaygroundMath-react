import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountService } from '../services/accountService';
import { toast } from 'react-toastify';

export const useCreateAccount = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(3);
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    age?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    setFormErrors({});
    setIsLoading(true);

    try {
      const response = await AccountService.createAccount({ username, age });

      if (response.success) {
        toast.success('Nalog je uspešno kreiran');
        navigate('/accounts');
      } else {
        const newFormErrors: { username?: string; age?: string } = {};
        response.errors?.forEach((errorObj) => {
          if (errorObj.username) newFormErrors.username = errorObj.username;
          if (errorObj.age) newFormErrors.age = errorObj.age;
        });
        setFormErrors(newFormErrors);
      }
    } catch (error) {
      toast.error('Došlo je do greške prilikom kreiranja naloga');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    age,
    formErrors,
    isLoading,
    setUsername,
    setAge,
    handleCreateAccount,
  };
}; 