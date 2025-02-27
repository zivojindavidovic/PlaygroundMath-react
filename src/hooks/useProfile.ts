import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/constants';

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
      setError('Please enter your password');
      return;
    }

    try {
      const endpoint = deleteMode === 'user' 
        ? `${API_BASE_URL}/user/${userId}`
        : `${API_BASE_URL}/account/${selectedAccountId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete');
      }

      if (deleteMode === 'user') {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        await fetchUserData();
        closeModal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword('');
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