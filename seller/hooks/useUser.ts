import { useCallback } from 'react';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

const USERS_STORAGE_KEY = 'klink_users';
const CURRENT_USER_EMAIL_KEY = 'klink_currentUserEmail';

export const useUser = () => {
  // --- User List Management ---
  const getUsers = useCallback((): User[] => {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return [];
    }
  }, []);

  const saveUsers = useCallback((users: User[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, []);

  const addUser = useCallback((user: User) => {
    const users = getUsers();
    const userExists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (!userExists) {
      saveUsers([...users, user]);
    }
  }, [getUsers, saveUsers]);


  // --- Active User Session Management ---
  const setCurrentUser = useCallback((email: string) => {
    localStorage.setItem(CURRENT_USER_EMAIL_KEY, email);
  }, []);
  
  const getCurrentUser = useCallback((): User | null => {
    const activeEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
    if (!activeEmail) return null;
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === activeEmail.toLowerCase()) || null;
  }, [getUsers]);

  const clearCurrentUser = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
  }, []);
  
  // --- Update User Data ---
  const updateCurrentUser = useCallback((updatedData: Partial<Omit<User, 'email'>>) => {
      const activeUser = getCurrentUser();
      if (!activeUser) return;

      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === activeUser.email);
      
      if (userIndex > -1) {
          users[userIndex] = { ...users[userIndex], ...updatedData };
          saveUsers(users);
          // Manually trigger a storage event so other tabs/components update
          window.dispatchEvent(new Event('storage'));
      }
  }, [getUsers, getCurrentUser, saveUsers]);

  const updateUserEmail = useCallback((newEmail: string): boolean => {
    const activeUser = getCurrentUser();
    if (!activeUser) return false;

    const users = getUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === newEmail.toLowerCase());
    if (emailExists) {
      console.error("New email already in use.");
      return false;
    }

    const userIndex = users.findIndex(u => u.email === activeUser.email);
    if (userIndex > -1) {
      users[userIndex].email = newEmail;
      saveUsers(users);
      setCurrentUser(newEmail); // Also update the active session email
      window.dispatchEvent(new Event('storage'));
      return true;
    }
    return false;
  }, [getUsers, getCurrentUser, saveUsers, setCurrentUser]);


  return { 
      getUsers, 
      addUser, 
      getCurrentUser, 
      setCurrentUser, 
      clearCurrentUser,
      updateCurrentUser,
      updateUserEmail
    };
};