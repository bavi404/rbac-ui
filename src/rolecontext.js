import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

const roles = {
  admin: { canAccess: ['dashboard', 'users', 'roles', 'permissions'] },
  manager: { canAccess: ['dashboard', 'users', 'roles'] },
  viewer: { canAccess: ['dashboard'] },
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('viewer'); // Default role

  const isAuthorized = (page) => roles[role]?.canAccess.includes(page);

  return (
    <RoleContext.Provider value={{ role, setRole, isAuthorized }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
