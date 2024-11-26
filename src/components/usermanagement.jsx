import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/users').then((response) => setUsers(response.data));
  }, []);

  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('userManagement')}</h2>
      <input
        type="text"
        placeholder={t('searchUsers')}
        className="border px-3 py-2 rounded mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2">{t('name')}</th>
            <th className="px-4 py-2">{t('email')}</th>
            <th className="px-4 py-2">{t('role')}</th>
            <th className="px-4 py-2">{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
