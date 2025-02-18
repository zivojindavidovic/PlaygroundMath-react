import { useState, useEffect } from 'react';
import { Account } from '../types/account';
import { AccountService } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAccountsList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await AccountService.getAccounts(userId);
      if (data.success && data.results && data.results[0]) {
        setAccounts(data.results[0].accounts);
      } else {
        setError('No accounts found');
      }
    } catch (err) {
      setError('Failed to load accounts');
      toast.error('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountClick = (accountId: number) => {
    navigate(`/game/${accountId}`);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, isLoading, error, handleAccountClick };
}; 