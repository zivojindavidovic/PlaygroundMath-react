export const API_BASE_URL = 'http://0.0.0.0:8000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/user/register'
  },
  ACCOUNT: {
    CREATE: '/account/create',
    RANK_LIST: '/account/rankList',
    GET_ALL: '/account/getAll',
    DELETE: '/account/delete'
  },
  USER: {
    TEACHERS: '/user/teachers',
    DELETE: '/user/delete'
  },
  COURSE: {
    CREATE: '/course/create',
    APPLICATIONS: '/course/applications',
    RESOLVE_APPLICATION: '/course/resolveApplication',
    MY_COURSES: '/course/myCourses'
  }
}; 