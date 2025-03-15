import Navbar from '@/components/Navbar';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import React from 'react';
import { useRouter } from 'next/router';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import axios from 'axios';

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
  const router = useRouter();

  const exportToExcel = async (apiPath, fileName) => {
    // Menambahkan parameter query
    const params = new URLSearchParams({
      search: '',
      limit: '999999',
      page: '1',
    });

    try {
      const response = await axios.get(apiPath, { params }); // Menggunakan axios untuk mengambil data
      const data = response.data?.data?.results?.data;

      // Konversi data ke format Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Buat file Excel dan unduh
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <>
      <Navbar tittlePage="Rekap Data" />
      <div className="h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 w-full h-full gap-4">
          {dataRekap.map((item, index) => (
            <div
              key={index}
              className={`${item.color} border  p-6 shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl text-center flex flex-col items-center justify-center w-full h-full text-white font-bold text-2xl rounded-2xl`}
              onClick={() => exportToExcel(item.api, item.fileName)} // Panggil fungsi ekspor dengan nama file
            >
              <FaFileExcel className="text-5xl mb-4" />
              <h3>{item.title}</h3>
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
