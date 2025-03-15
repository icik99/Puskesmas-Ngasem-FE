import MetaHead from '@/components/MetaHead';
import Modal from '@/components/Modal';
import ModalDelete from '@/components/ModalDelete';
import Navbar from '@/components/Navbar';
import TablePagination from '@/components/TablePagination';
import useFetchData from '@/hooks/useFetchData';
import handleImage from '@/utils/handleImage';
import { withSession } from '@/utils/sessionWrapper';
import axios from 'axios';
import { useFormik } from 'formik';
import { toNumber } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidPencil } from 'react-icons/bi';
import { IoMdArchive } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

export default function LogActivity({ user }) {
  const {
    data: dataLogAtivity,
    pagination: paginationLogAtivity,
    fetchData: fetchDataLogAtivity,
    setSearch: setSearchLogAtivity,
    debouncedFetchData: debouncedFetchDataLogAtivity,
  } = useFetchData('/api/log-activity/get');

  const kolomLogAtivity = [
    {
      header: 'No.',
      cell: (row) => (
        <h1>
          {toNumber(row.row.index) +
            1 +
            (paginationLogAtivity.currentPage - 1) *
              paginationLogAtivity.dataPerpages}
          .
        </h1>
      ),
    },
    { header: 'Tanggal Dikembalikan', accessorKey: 'tanggalDikembalikan',
      cell: ({ row }) => (
              <p>{moment(row.original.tanggalDikembalikan).format('DD MMMM YYYY HH:mm')} WIB</p>
            ),
     },
    { header: 'Tanggal Peminjaman', accessorKey: 'tanggalPeminjaaman',
      cell: ({ row }) => (
              <p>{moment(row.original.tanggalPeminjaaman).format('DD MMMM YYYY HH:mm')} WIB</p>
            ),
     },
    { header: 'No. RM', accessorKey: 'nomerRM' },
    { header: 'Petugas', accessorKey: 'Petugas' },
    { header: 'Aksi', accessorKey: 'Aksi' },
    { header: 'Deskripsi', accessorKey: 'Deskripsi' },
    { header: 'Dokter Peminjam', accessorKey: 'Dokter' },
  ];
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchDataLogAtivity();
  }, [refresh]);

  return (
    <div>
      <MetaHead title={'Buku Ekspedisi | Puskesmas Ngasem'} />

      <Navbar tittlePage={'Buku Ekspedisi - Riwayat Peminjaman Rekam Medis'} />
      <div className="mb-10">
        <TablePagination
          data={dataLogAtivity}
          columns={kolomLogAtivity}
          fetchData={fetchDataLogAtivity}
          pagination={paginationLogAtivity}
          setSearch={setSearchLogAtivity}
          debouncedFetchData={debouncedFetchDataLogAtivity}
          showSearchBar={true}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const accessToken = req.session?.auth?.access_token;
  const user = req.session?.user || [];
  const isLoggedIn = !!accessToken;
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
});
