export const API = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    WHOAMI: '/api/auth/whoami',
    UPDATE_PROFILE: '/api/auth/update-profile',
    REQUEST_PASSWORD_RESET: '/api/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password`,
    SEND_VERIFICATION_EMAIL: '/api/auth/send-verification-email',
    VERIFY_EMAIL: (token: string) => `/api/auth/verify-email/${token}`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: (id: string) => `/api/admin/users/${id}`,
    USER_CREATE: '/api/admin/users',
    USER_UPDATE: (id: string) => `/api/admin/users/${id}`,
    USER_DELETE: (id: string) => `/api/admin/users/${id}`,
    EMAIL_VERIFICATION: '/api/admin/email-verification',
  }
};