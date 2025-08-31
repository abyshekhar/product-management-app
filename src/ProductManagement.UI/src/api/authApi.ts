import api from "./api";

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export const loginApi = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  console.log(response);
  
  return response.data;
};
