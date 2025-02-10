export interface Response<T> {
  statusCode?: number;
  message?: string;
  data: T;
}

export interface RegisterUserResponse {
  id?: string;
  username: string;
}

export interface IsUserExistResponse {
  isUserExist: boolean;
}
