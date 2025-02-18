import { useState, useEffect } from 'react';
import { AdminAccount } from '../types/admin';
import { AdminService } from '../services/adminService';
import { toast } from 'react-toastify';

export const useAdminAccounts = () => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointsMap, setPointsMap] = useState<Record<number, number>>({});

  const fetchAccounts = async () => {
    try {
      const data = await AdminService.getAccounts();
      setAccounts(data);
      const initialPoints = data.reduce((acc: Record<number, number>, account: AdminAccount) => {
        acc[account.accountId] = account.points;
        return acc;
      }, {});
      setPointsMap(initialPoints);
    } catch (error) {
      setError('Failed to fetch accounts');
      toast.error('Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePoints = async (accountId: number) => {
    try {
      await AdminService.updatePoints({
        accountId,
        points: pointsMap[accountId]
      });
      toast.success('Points updated successfully');
    } catch (error) {
      toast.error('Failed to update points');
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { 
    accounts, 
    isLoading, 
    error, 
    pointsMap, 
    setPointsMap, 
    handleUpdatePoints, 
    handleDeleteAccount 
  };
}; 