import Navbar from '@/components/Navbar';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import axios from 'axios';
import MetaHead from '@/components/MetaHead';

const dataRekap = [
  {
    title: 'Rekap Data User (excel)',
    color: 'bg-purple-500',
    api: '/api/user/get',
    fileName: 'rekap_data_user.xlsx',
  },
  {
    title: 'Rekap Data Pasien (excel)',
    color: 'bg-blue-500',
    api: '/api/patient/get',
    fileName: 'rekap_data_pasien.xlsx',
  },
  {
    title: 'Rekap Data Rekam Medis (excel)',
    color: 'bg-green-500',
    api: '/api/rekam-medis/get',
    fileName: 'rekap_data_rekam_medis.xlsx',
  },
  {
    title: 'Rekap Data Dokter (excel)',
    color: 'bg-yellow-500',
    api: '/api/user/get-dokter',
    fileName: 'rekap_data_dokter.xlsx',
  },
  {
    title: 'Rekap Data Peminjaman Rekam Medis (excel)',
    color: 'bg-red-500',
    api: '/api/peminjaman-rekam-medis/get',
    fileName: 'rekap_data_peminjaman_rekam_medis.xlsx',
  },
  {
    title: 'Rekap Data Buku Ekspedisi - Riwayat Peminjaman RM (excel)',
    color: 'bg-gray-500',
    api: '/api/log-activity/get',
    fileName: 'buku_ekspedisi_peminjaman_rekam_medis.xlsx',
  },
];

export default function RekapData({ listCountDashboard }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRekap, setSelectedRekap] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const exportToExcel = async () => {
    if (!selectedRekap) return;

    const params = new URLSearchParams({
      search: '',
      limit: '999999',
      page: '1',
      start_date: startDate,
      end_date: endDate,
    });

    try {
      const response = await axios.get(selectedRekap.api, { params });
      const data = response.data?.data?.results?.data;

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, selectedRekap.fileName);

      setShowModal(false);
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <>
      <MetaHead title={'Rekap Data | Puskesmas Ngasem'} />
      <Navbar tittlePage="Rekap Data" />

      <div className="h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 w-full h-full gap-4">
          {dataRekap.map((item, index) => (
            <div
              key={index}
              className={`${item.color} border p-6 shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl text-center flex flex-col items-center justify-center w-full h-full text-white font-bold text-2xl rounded-2xl`}
              onClick={() => {
                setSelectedRekap(item);
                setShowModal(true);
              }}
            >
              <FaFileExcel className="text-5xl mb-4" />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Pilih Tanggal Rekap</h2>
            <div className="flex flex-col gap-3 mb-4">
              <label className="text-sm">
                Tanggal Mulai:
                <input
                  type="date"
                  className="border rounded w-full mt-1 p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Tanggal Selesai:
                <input
                  type="date"
                  className="border rounded w-full mt-1 p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={exportToExcel}
                disabled={!startDate || !endDate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Ekspor
              </button>
            </div>
          </div>
        </div>
      )}
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
  try {
    const res = await ClientRequest.GetCountDashboard(accessToken);
    dataCountDashboard = res.data.data || {};
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  return {
    props: {
      user,
      listCountDashboard: dataCountDashboard,
    },
  };
});
