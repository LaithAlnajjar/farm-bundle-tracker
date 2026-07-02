export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  email: string;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
}