export const useAuthStore = () => {
  return {
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
  };
};
