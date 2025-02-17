import Navbar from '@/components/Navbar';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket'; // Import the socket instance
import { notification } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  FaFileMedical,
  FaFileExcel,
  FaHandHoldingMedical,
  FaClock,
  FaUsers,
} from 'react-icons/fa';

export default function Dashboard({ listCountDashboard, totalTerupdate }) {
  const [data, setData] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (listCountDashboard) {
      setData(listCountDashboard);
    }
    if (totalTerupdate > 0) {
      api.info({
        message: `Peringatan Keterlambatan`,
        description: `Terdapat ${totalTerupdate} rekam medis terlambat dikembalikan!`,
        duration: 0, // Notifikasi tidak akan hilang sendiri
      });
    }
  }, [listCountDashboard, totalTerupdate]);

  useEffect(() => {

    socket.on('notification', (msg) => {
      api.warning({
        message: msg.message,
        description: `Detail ID: ${msg.details.join(', ')}`,
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      // No need to disconnect here since we are using a singleton instance
      socket.disconnect(); // Comment this out
    };
  }, []);

  if (!data) return <p className="text-center text-gray-600">Loading...</p>;

  const chartData = [
    { label: 'Total RM', Jumlah: data.totalRekamMedis },
    { label: 'RM Tidak Lengkap', Jumlah: data.totalIncompleteRekamMedis },
    { label: 'RM Dipinjam', Jumlah: data.totalPeminjamanDipinjam },
    {
      label: 'RM Terlambat Dikembalikan',
      Jumlah: data.totalPeminjamanTerlambat,
    },
    { label: 'Total Pasien', Jumlah: data.totalPasien },
  ];

  const icons = [
    <FaFileMedical key={1} className="text-blue-500 text-3xl" />,
    <FaFileExcel key={2} className="text-green-500 text-3xl" />,
    <FaHandHoldingMedical key={3} className="text-orange-500 text-3xl" />,
    <FaClock key={4} className="text-red-500 text-3xl" />,
    <FaUsers key={5} className="text-purple-500 text-3xl" />,
  ];

  return (
    <>
      {contextHolder}
      <Navbar tittlePage="Dashboard" />
      <div className="min-h-screen px-4 py-6 md:px-8 bg-gray-50">
        {/* Chart Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full overflow-x-auto">
          <BarChart
            width={800}
            height={300}
            data={chartData}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Jumlah" fill="#3b82f6" />
          </BarChart>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex items-center"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                {icons[index]}
              </div>
              <div className="ml-4">
                <p className="text-gray-600 font-medium">{item.label}</p>
                <h2 className="text-xl font-bold text-gray-800">
                  {item.Jumlah}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const accessToken = req.session?.auth?.access_token;
  const user = req.session?.user || null;
  if (!accessToken) {
    return { redirect: { destination: '/auth/login', permanent: false } };
  }

  let dataCountDashboard = {};
  let checkStatusData = { totalTerupdate: 0 };

  try {
    const res = await ClientRequest.GetCountDashboard(accessToken);
    dataCountDashboard = res.data.data || {};

    // Check status rekam medis
    const checkRes = await ClientRequest.CheckRekamMedisStatus(accessToken);
    checkStatusData = checkRes.data || { totalTerupdate: 0 };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  return {
    props: {
      user,
      listCountDashboard: dataCountDashboard,
      totalTerupdate: checkStatusData.totalTerupdate || 0,
    },
  };
});
