export const storage = {
  setAuthData: (data: {
    accessToken: string;
    userId: string;
    email: string;
    isTeacher: boolean;
  }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('email', data.email);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isTeacher', String(data.isTeacher));
  },
  clearAuth: () => {
    localStorage.clear();
  }
};