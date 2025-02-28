import { useState, useEffect } from 'react';
import { AdminAccount } from '../types/admin';
import { AdminService } from '../services/adminService';
import { toast } from 'react-toastify';

export const useAdminAccounts = () => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStates, setEditingStates] = useState<Record<number, { points: number; username: string }>>({});

  const fetchAccounts = async () => {
    try {
      const data = await AdminService.getAccounts();
      setAccounts(data);
      const initialStates = data.reduce((acc: Record<number, { points: number; username: string }>, account: AdminAccount) => {
        acc[account.accountId] = {
          points: account.points,
          username: account.username
        };
        return acc;
      }, {});
      setEditingStates(initialStates);
    } catch (error) {
      setError('Failed to fetch accounts');
      toast.error('Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAccount = async (accountId: number) => {
    try {
      const accountState = editingStates[accountId];
      const response = await AdminService.updatePoints({
        accountId,
        points: accountState.points,
        username: accountState.username
      });
      
      if (response.success) {
        setAccounts(accounts.map(account => 
          account.accountId === accountId 
            ? { ...account, points: accountState.points, username: accountState.username }
            : account
        ));
        toast.success('Account updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update account');
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    try {
      await AdminService.deleteAccount(accountId);
      setAccounts(accounts.filter(account => account.accountId !== accountId));
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const updateEditingState = (accountId: number, field: 'points' | 'username', value: string | number) => {
    setEditingStates(prev => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { 
    accounts, 
    isLoading, 
    error, 
    editingStates,
    updateEditingState,
    handleUpdateAccount, 
    handleDeleteAccount 
  };
}; 