import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'operator' | 'viewer';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canApply: boolean;
  canRegister: boolean;
  canDelete: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('operator'); // Default to operator

  const canApply = role === 'admin' || role === 'operator';
  const canRegister = role === 'admin' || role === 'operator';
  const canDelete = role === 'admin';

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        canApply,
        canRegister,
        canDelete,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
