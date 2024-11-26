import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles from mock API
  useEffect(() => {
    axios.get('http://localhost:3001/roles').then((response) => {
      setRoles(response.data);
    });
  }, []);

  // Filter roles based on search query
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort roles based on sortKey and sortOrder
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    const compareA = a[sortKey].toLowerCase();
    const compareB = b[sortKey].toLowerCase();
    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate roles
  const paginatedRoles = sortedRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle sorting
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Handle Add/Edit Modal
  const handleAddEdit = (role) => {
    setSelectedRole(role || { name: '', permissions: [] });
    setIsModalOpen(true);
  };

  // Save Role (Add or Edit)
  const saveRole = (e) => {
    e.preventDefault();
    if (selectedRole.id) {
      axios
        .put(`http://localhost:3001/roles/${selectedRole.id}`, selectedRole)
        .then(() => {
          setRoles(
            roles.map((r) => (r.id === selectedRole.id ? selectedRole : r))
          );
          toast.success('Role updated successfully!');
        });
    } else {
      axios.post('http://localhost:3001/roles', selectedRole).then((response) => {
        setRoles([...roles, response.data]);
        toast.success('Role added successfully!');
      });
    }
    setIsModalOpen(false);
  };

  // Delete Role
  const deleteRole = (id) => {
    axios.delete(`http://localhost:3001/roles/${id}`).then(() => {
      setRoles(roles.filter((role) => role.id !== id));
      toast.error('Role deleted!');
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Role Management</h2>

      {/* Search Input */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search roles by name"
          className="w-full px-3 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => toggleSort('name')}
            >
              Role Name
            </th>
            <th className="px-4 py-2">Permissions</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((role) => (
            <tr key={role.id} className="border-b">
              <td className="px-4 py-2">{role.name}</td>
              <td className="px-4 py-2">
                {role.permissions.join(', ') || 'No Permissions'}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleAddEdit(role)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteRole(role.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          className="bg-gray-400 text-white px-2 py-1 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="bg-gray-400 text-white px-2 py-1 rounded"
          disabled={currentPage * itemsPerPage >= sortedRoles.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={saveRole}>
          <div className="mb-4">
            <label className="block text-gray-700">Role Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Role Name"
              value={selectedRole?.name || ''}
              onChange={(e) =>
                setSelectedRole({ ...selectedRole, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {['Read', 'Write', 'Delete'].map((permission) => (
                <label key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedRole?.permissions.includes(permission)}
                    onChange={(e) => {
                      const updatedPermissions = e.target.checked
                        ? [...selectedRole.permissions, permission]
                        : selectedRole.permissions.filter((p) => p !== permission);
                      setSelectedRole({
                        ...selectedRole,
                        permissions: updatedPermissions,
                      });
                    }}
                  />
                  {permission}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default RoleManagement;
