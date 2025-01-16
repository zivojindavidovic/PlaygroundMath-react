import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/HomePage.scss';

interface Account {
    accountId: number;
    username: string;
    points: number;
}

const HomePage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const loggedInUserId = localStorage.getItem('loggedInUserId');
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    console.error('No access token found. Redirecting to login.');
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://0.0.0.0:8000/api/v1/account/user/${loggedInUserId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAccounts(data.accounts || []);
                } else {
                    console.error('Failed to fetch accounts:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                await fetch('http://0.0.0.0:8000/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            toast.info('Logged Out');
            navigate('/login');
        }
    };

    const handleCreateAccount = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewUsername('');
    };

    const handleModalSubmit = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                toast.error('No access token found. Please log in again.');
                return;
            }

            const response = await fetch('http://0.0.0.0:8000/api/v1/account/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (response.ok) {
                toast.success('Account created successfully!');
                handleModalClose();
                const loggedInUserId = localStorage.getItem('loggedInUserId');
                const refetchResponse = await fetch(`http://0.0.0.0:8000/api/v1/account/user/${loggedInUserId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (refetchResponse.ok) {
                    const data = await refetchResponse.json();
                    setAccounts(data.accounts || []);
                }
            } else {
                toast.error('Failed to create account.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleDeleteAccount = async (accountId: number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                toast.error('No access token found. Please log in again.');
                return;
            }

            const response = await fetch(`http://0.0.0.0:8000/api/v1/account/delete/${accountId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                toast.success('Account deleted successfully!');
                setAccounts(accounts.filter(account => account.accountId !== accountId));
            } else {
                toast.error('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="home-page">
            <header className="header">
                <h1>Welcome</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>

            <div className="accounts-container">
                {Array.from({ length: 3 }).map((_, index) => {
                    const account = accounts[index];
                    return (
                        <div key={index} className="account-card">
                            {account ? (
                                <Link to={`/account/${account.accountId}`}>
                                    <div>
                                        <h2>{account.username}</h2>
                                        <p>Points: {account.points}</p>
                                    </div>
                                </Link>
                            ) : (
                                <button onClick={handleCreateAccount} className="create-account-button">+</button>
                            )}
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create Account</h2>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleModalSubmit} className="submit-button">Create Account</button>
                            <button onClick={handleModalClose} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;