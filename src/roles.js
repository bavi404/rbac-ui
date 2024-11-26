const roles = {
    admin: {
      canAccess: ['dashboard', 'users', 'roles', 'permissions'], // Full access
    },
    manager: {
      canAccess: ['dashboard', 'users', 'roles'], // No permission matrix access
    },
    viewer: {
      canAccess: ['dashboard'], // Can only view the dashboard
    },
  };
  
  export default roles;
  