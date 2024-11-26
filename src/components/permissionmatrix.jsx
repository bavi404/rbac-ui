import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PermissionMatrix = () => {
  const [roles, setRoles] = useState([]);
  const [permissions] = useState(['Read', 'Write', 'Delete']);

  // Fetch roles from mock API
  useEffect(() => {
    axios.get('http://localhost:3001/roles').then((response) => {
      setRoles(response.data);
    });
  }, []);

  // Toggle permission for a role
  const togglePermission = (roleId, permission) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter((p) => p !== permission)
                : [...role.permissions, permission],
            }
          : role
      )
    );

    // Update mock API
    const roleToUpdate = roles.find((role) => role.id === roleId);
    axios.put(`http://localhost:3001/roles/${roleId}`, {
      ...roleToUpdate,
      permissions: roleToUpdate.permissions.includes(permission)
        ? roleToUpdate.permissions.filter((p) => p !== permission)
        : [...roleToUpdate.permissions, permission],
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Permission Matrix</h2>
      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2">Role</th>
            {permissions.map((permission) => (
              <th key={permission} className="px-4 py-2">
                {permission}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b">
              <td className="px-4 py-2">{role.name}</td>
              {permissions.map((permission) => (
                <td key={permission} className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission)}
                    onChange={() => togglePermission(role.id, permission)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;
