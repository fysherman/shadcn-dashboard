import { Employee, Nullable, Role } from '@/types';
import { create } from 'zustand';

export type UserStoreState = Nullable<{
  user: Employee;
  role: Role;
}>;

export interface UserStoreAction {
  setUser: (user?: Employee) => void;
}

export const useUserStore = create<UserStoreState & UserStoreAction>()(
  (set) => ({
    user: null,
    role: null,
    setUser(user?: Employee) {
      set(() => ({ user, role: user?.role }));
    }
  })
);
