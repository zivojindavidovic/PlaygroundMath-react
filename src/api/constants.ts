export const API_BASE_URL = 'http://local.kotlin/api/v1';

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
    GET_ALL_FOR_APPLICATION: '/account/getAllForApplication',
    DELETE: '/account/delete',
    GET: '/account/get'
  },
  USER: {
    TEACHERS: '/user/teachers',
    DELETE: '/user/delete'
  },
  COURSE: {
    ALL: '/course/all',
    APPLY: '/course/apply',
    CREATE: '/course/create',
    APPLICATIONS: '/course/applications',
    RESOLVE_APPLICATION: '/course/resolveApplication',
    MY_COURSES: '/course/myCourses',
    LIST: '/course/list'
  },
  TASK: {
    GENERATE: '/task/generate',
    SOLVE: '/task/solve',
    UNRESOLVED: '/task/unresolved'
  },
  ADMIN: {
    USERS: '/admin/users',
    ACCOUNTS: '/admin/accounts',
    DELETEUSER: '/admin/delete-user',
    DELETEACCOUNT: '/admin/delete-account',
    UPDATEPOINTS: '/admin/update-account-points',
    UPDATEUSER: '/admin/update-user'
  },
  CONFIG: {
    GET: '/config',
  },
  TEST: {
    UNRESOLVED: '/test/unresolved',
  }
}; 