export const setToken = (token: string) => {
  localStorage.setItem("jwt_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("jwt_token");
};

export const isLoggedIn = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("jwt_token");
};
