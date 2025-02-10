export const ERROR = {
  FIRST_NAME: {
    REQUIRED: 'First name is required',
    TYPE_STRING: 'First name must be a string',
    LENGTH: 'First name should contain minimum 3 and maximum of 30 characters',
  },
  LAST_NAME: {
    REQUIRED: 'Last name is required',
    TYPE_STRING: 'Last name must be a string',
    LENGTH: 'Last name should contain minimum 3 and maximum of 30 characters',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    TYPE_STRING: 'Email must be a string',
    INVALID_FORMAT: 'Enter a valid email address',
    ALREADY_VERIFIED: 'Email address is already verified',
    VERIFY: 'Verify your email address to continue',
    FAILED_TO_VERIFY: 'Failed to verify email',
    MIS_MATCH: `The given email mismatches with the user's registered email`,
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    TYPE_STRING: 'Password must be a string',
    LENGTH: 'Password should contain minimum 8 and maximum of 16 characters',
    INVALID_FORMAT:
      'Password must contain at least 8 characters, including letter, number and special character',
  },
  USER: {
    ID_REQUIRED: 'User ID is required',
    NOT_FOUND: 'User not found',
    ACCESS_DENIED: 'Access denied',
    EMAIL_EXISTS: 'User with this email id already exists',
    INVALID: 'Invalid user',
    INVALID_EMAIL_OR_PASSWORD: 'Incorrect email or password',
    USERNAME_OR_PHONENUMBER_REQUIRED: 'Username or phone number is required',
    UNAUTHORIZED_USER: 'Unauthorized user',
    REMOVE_NOT_ALLOWED: 'Cannot remove yourself from system',
  },
  TOKEN: {
    NOT_FOUND: 'Token not found',
    INVALID: 'Invalid token',
  },
  SESSION: {
    EXPIRED: 'Session expired. Please try again',
    LAST_LOGGED_IN_DEVICE: 'Only recently logged in device can be trusted',
  },
  REFRESH_TOKEN: {
    NO_TOKEN: 'No refresh token provided',
    NOT_FOUND: 'Refresh token not found',
    EXPIRED: 'Refresh token expired',
  },
  COMMON_MESSAGES: {
    VALIDATION_FAILED: 'Validation failed',
  },
  AUTH: {
    LOGOUT_FAILED: 'Failed to logout',
  }
};
