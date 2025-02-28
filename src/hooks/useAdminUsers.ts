import { useState, useEffect } from 'react';
import { AdminUser } from '../types/admin';
import { AdminService } from '../services/adminService';
import { toast } from 'react-toastify';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await AdminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateUser = async (userId: number, firstName: string, lastName: string) => {
    try {
      const response = await AdminService.updateUser({ userId, firstName, lastName });
      if (response.success) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, firstName, lastName }
            : user
        ));
        setEditingUser(null);
        toast.success('User updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { 
    users, 
    isLoading, 
    error, 
    handleDeleteUser, 
    editingUser, 
    setEditingUser, 
    handleUpdateUser 
  };
}; 