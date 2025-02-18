export const storage = {
  setAuthData: (data: {
    accessToken: string;
    userId: string;
    email: string;
  }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('email', data.email);
    localStorage.setItem('isLoggedIn', 'true');
    
    try {
      const token = data.accessToken;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      localStorage.setItem('isAdmin', String(payload.role === 'ADMIN'));
      localStorage.setItem('isParent', String(payload.role === 'PARENT'));
      localStorage.setItem('isTeacher', String(payload.role === 'TEACHER'));
    } catch (error) {
      console.error('Error parsing JWT:', error);
    }
  },
  
  clearAuth: () => {
    localStorage.clear();
  }
};