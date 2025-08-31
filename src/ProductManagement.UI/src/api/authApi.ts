import api from "./api";

export interface User {
  id: number;
  username: string;
  role: ("Admin" | "User");
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: User;
}

export const loginApi = async (data: LoginDto): Promise<LoginResponseDto> => {
  const response = await api.post<LoginResponseDto>("/auth/login", data);
  return response.data;
};
