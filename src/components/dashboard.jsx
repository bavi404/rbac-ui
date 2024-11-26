import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { t } = useTranslation();
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [rolesData, setRolesData] = useState({});
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await axios.get('http://localhost:3001/users');
        const roles = await axios.get('http://localhost:3001/roles');

        setUserCount(users.data.length);
        setRoleCount(roles.data.length);
        setActiveUsers(users.data.filter((user) => user.status === 'Active').length);

        const roleDistribution = users.data.reduce((acc, user) => {
          acc[user.role] = acc[user.role] ? acc[user.role] + 1 : 1;
          return acc;
        }, {});
        setRolesData(roleDistribution);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStats();
  }, []);

  const barData = {
    labels: Object.keys(rolesData),
    datasets: [
      {
        label: t('usersPerRole'),
        data: Object.values(rolesData),
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
      },
    ],
  };

  const pieData = {
    labels: [t('activeUsers'), t('inactiveUsers')],
    datasets: [
      {
        label: t('userStatus'),
        data: [activeUsers, userCount - activeUsers],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-500 text-white p-6 rounded shadow">
        <h3 className="text-2xl">{t('totalUsers')}</h3>
        <p className="text-4xl">{userCount}</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded shadow">
        <h3 className="text-2xl">{t('totalRoles')}</h3>
        <p className="text-4xl">{roleCount}</p>
      </div>
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h3 className="text-xl mb-4">{t('usersPerRole')}</h3>
        <Bar data={barData} />
      </div>
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h3 className="text-xl mb-4">{t('userStatusDistribution')}</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
