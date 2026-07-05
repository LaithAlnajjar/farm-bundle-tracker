export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse extends AuthUser {
  accessToken: string;
}

export interface RefreshSessionResponse {
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  email: string;
  username: string;
}
