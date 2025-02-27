import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/constants';
import { ProfileService } from '../services/profileService';
import { DeleteUserRequest, DeleteAccountRequest } from '../types/profile';

interface Account {
  accountId: number;
  username: string;
  points: number;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accounts: Account[];
}

export const useProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteMode, setDeleteMode] = useState<'user' | 'account' | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!password) {
      setModalError('Please enter your password');
      return;
    }

    if (!userId) {
      setModalError('User ID not found');
      return;
    }

    try {
      if (deleteMode === 'user') {
        const deleteUserData: DeleteUserRequest = {
          userId,
          password
        };
        const response = await ProfileService.deleteUser(deleteUserData);
        if (!response.success) {
          setModalError(response.errors?.[0]?.password || 'Failed to delete user');
          return;
        }
        localStorage.clear();
        window.location.href = '/login';
      } else {
        if (!selectedAccountId) {
          setModalError('No account selected');
          return;
        }
        const deleteAccountData: DeleteAccountRequest = {
          accountId: selectedAccountId,
          userPassword: password
        };
        const response = await ProfileService.deleteAccount(deleteAccountData);
        if (!response.success) {
          setModalError(response.errors?.[0]?.password || 'Failed to delete account');
          return;
        }
        await fetchUserData();
        closeModal();
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword('');
    setModalError(null);
    setError(null);
    setDeleteMode(null);
    setSelectedAccountId(null);
  };

  useEffect(() => {
    if (userId && accessToken) {
      fetchUserData();
    }
  }, [userId, accessToken]);

  return {
    userData,
    isLoading,
    error,
    modalError,
    showModal,
    password,
    deleteMode,
    selectedAccountId,
    setShowModal,
    setPassword,
    setDeleteMode,
    setSelectedAccountId,
    handleDelete,
    closeModal,
  };
}; 