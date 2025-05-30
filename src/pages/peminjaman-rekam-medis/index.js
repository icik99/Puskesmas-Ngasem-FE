import MetaHead from '@/components/MetaHead';
import Modal from '@/components/Modal';
import Navbar from '@/components/Navbar';
import TablePagination from '@/components/TablePagination';
import useFetchData from '@/hooks/useFetchData';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import socket from '@/utils/socket';
import { notification } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';
import { toNumber } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import toast from 'react-hot-toast';
import { BiSolidPencil } from 'react-icons/bi';

export default function PeminjamanRekamMedis({
  user,
  listRekamMedis,
  listDokter,
  totalTerupdate,
}) {
  const {
    data: dataPeminjamanRekamMedis,
    pagination: paginationPeminjamanRekamMedis,
    fetchData: fetchDataPeminjamanRekamMedis,
    setSearch: setSearchPeminjamanRekamMedis,
    debouncedFetchData: debouncedFetchDataPeminjamanRekamMedis,
  } = useFetchData('/api/peminjaman-rekam-medis/get');

  console.log(dataPeminjamanRekamMedis);
  const kolomPeminjamanRekamMedis = [
    {
      header: 'No.',
      cell: (row) => (
        <h1>
          {toNumber(row.row.index) +
            1 +
            (paginationPeminjamanRekamMedis.currentPage - 1) *
              paginationPeminjamanRekamMedis.dataPerpages}
          .
        </h1>
      ),
    },
    { header: 'Nama Pasien', accessorKey: 'NamaPasien' },
    { header: 'No. RM Pasien', accessorKey: 'NoRMPasien' },
    {
      header: 'Tanggal Peminjaman',
      accessorKey: 'tanggalPeminjaman',
      cell: ({ row }) => (
        <p>
          {moment(row.original.tanggalPeminjaman).format(
            'DD MMMM YYYY | HH:MM'
          )}{' '}
          WIB
        </p>
      ),
    },
    {
      header: 'Tanggal Dikembalikan',
      accessorKey: 'tanggalDikembalikan',
      cell: ({ row }) => (
        <p>
          {moment(row.original.tanggalDikembalikan).format(
            'DD MMMM YYYY | HH:mm'
          )}{' '}
          WIB
        </p>
      ),
    },
    { header: 'Keluhan', accessorKey: 'subjektif' },
    { header: 'Diagnosa Penyakit', accessorKey: 'diagnosaPenyakit' },
    {
      header: 'Status Peminjaman',
      accessorKey: 'StatusPeminjaman',
      cell: ({ row }) => {
        const status = row.original.StatusPeminjaman;

        const displayText =
          status === 'DIPINJAM'
            ? 'DIPINJAM'
            : status === 'TERSEDIA'
            ? 'TERSEDIA'
            : 'TERLAMBAT DIKEMBALIKAN ';

        const cellClass =
          status === 'DIPINJAM'
            ? 'bg-yellow-500 text-black py-3 rounded w-full text-center'
            : status === 'TERSEDIA'
            ? 'bg-green-500 text-black py-3 rounded w-full text-center'
            : 'bg-red-500 text-black py-3 rounded w-full text-center';

        return <p className={cellClass}>{displayText}</p>;
      },
    },

    {
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => openModalEdit(row.original.id)}
            className="flex items-center gap-1 px-4 py-2 text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            <BiSolidPencil className="text-lg" />
            Edit Data
          </button>
          <button
            onClick={() =>
              openModalEditStatus(row.original.id, row.original.idRekamMedis)
            }
            className="flex items-center gap-1 px-4 py-2 text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
          >
            <BiSolidPencil className="text-lg" />
            Edit Status
          </button>
        </div>
      ),
    },
  ];
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalEditStatus, setShowModalEditStatus] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idRekamMedis, setIdRekamMedis] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [dataKeterlambatan, setDataKeterlambatan] = useState();
  const [hasNotified, setHasNotified] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()

  const [selectedRekamMedis, setSelectedRekamMedis] = useState(null);
  const [selectedEditRekamMedis, setSelectedEditRekamMedis] = useState(null);

  // Format options untuk react-select
  const rekamMedisOptions = listRekamMedis.map(item => ({
    value: item.id,
    label: `${item.namaPasien} - ${moment(item.tanggalKunjungan).format('DD MMMM YYYY')}`,
    original: item
  }));

  const handleRekamMedisChange = (selectedOption) => {
    setSelectedRekamMedis(selectedOption);
    formik.setFieldValue('RekamMedis', selectedOption?.value || '');
  };

  const handleEditRekamMedisChange = (selectedOption) => {
    setSelectedEditRekamMedis(selectedOption);
    formik.setFieldValue('RekamMedis', selectedOption?.value || '');
  };

  useEffect(() => {
    if (totalTerupdate > 0) {
      api.info({
        message: `Peringatan Keterlambatan`,
        description: `Terdapat ${totalTerupdate} rekam medis terlambat dikembalikan!`,
        duration: 5, // Notifikasi tidak akan hilang sendiri
      });
    }
  }, []);

  // useEffect(() => {
  //   socket.on('notification', (msg) => {
  //     api.warning({
  //       message: msg.message,
  //       description: `Detail ID: ${msg.details.join(', ')}`,
  //     });
  //   });

  //   socket.on('connect_error', (error) => {
  //     console.error('Socket connection error:', error);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const formik = useFormik({
    initialValues: {
      alasanPeminjaman: '',
      tanggalDikembalikan: '',
      tanggalPeminjaman: '',
      Dokter: '',
      RekamMedis: '',
    },
    validate: (values) => {
      const requiredFields = [
        'alasanPeminjaman',
        'tanggalDikembalikan',
        'tanggalPeminjaman',
        'Dokter',
        'RekamMedis',
      ];

      const errors = Object.fromEntries(
        requiredFields
          .filter(
            (field) =>
              values[field] === undefined ||
              values[field] === null ||
              values[field] === ''
          )
          .map((field) => [field, `Field wajib diisi`])
      );

      // Validasi tanggalDikembalikan
      if (values.tanggalPeminjaman && values.tanggalDikembalikan) {
        const tanggalPeminjaman = new Date(values.tanggalPeminjaman);
        const tanggalDikembalikan = new Date(values.tanggalDikembalikan);

        // Hitung selisih dalam milidetik, lalu konversi ke hari
        const selisihHari =
          (tanggalDikembalikan - tanggalPeminjaman) / (1000 * 60 * 60 * 24);

        if (selisihHari < 0) {
          errors.tanggalDikembalikan =
            'Tanggal pengembalian tidak boleh sebelum tanggal peminjaman';
        } else if (selisihHari > 2) {
          errors.tanggalDikembalikan =
            'Tanggal pengembalian maksimal 2 hari dari tanggal peminjaman';
        }
      }
      console.log(values)
      return errors;
    },

    onSubmit: async (values) => {
      if (showModalAdd) {
        try {
          await toast.promise(
            axios.post(`/api/peminjaman-rekam-medis/post`, values),
            {
              loading: 'Processing...',
              success: (res) => {
                setShowModalAdd(!showModalAdd);
                formik.resetForm();
                setRefresh((prev) => !prev);
                return res.data || 'Sukses Membuat Peminjaman Baru';
              },
              error: (err) => {
                return err.response?.data?.error || 'Something went wrong';
              },
            }
          );
        } catch (error) {}
      } else {
        try {
          await toast.promise(
            axios.post(
              `/api/peminjaman-rekam-medis/update?id=${idRekamMedis}`,
              values
            ),
            {
              loading: 'Processing...',
              success: (res) => {
                setRefresh((prev) => !prev);
                setShowModalEdit(!showModalEdit);
                formik.resetForm();
                return res.data || 'Sukses Update Data Peminjaman';
              },
              error: (err) => {
                return err.response?.data?.error || 'Something went wrong';
              },
            }
          );
        } catch (error) {}
      }
    },
  });

  const formStatus = useFormik({
    initialValues: {
      statusPeminjaman: '',
      tanggalDikembalikan: '',
    },
    validate: (values) => {
      const requiredFields = ['statusPeminjaman', 'tanggalDikembalikan'];
      const errors = Object.fromEntries(
        requiredFields
          .filter(
            (field) =>
              values[field] === undefined ||
              values[field] === null ||
              values[field] === ''
          )
          .map((field) => [field, `Field wajib diisi`])
      );
      console.log(errors);
      return errors;
    },
    onSubmit: async (values) => {
      await toast.promise(
        axios.post(
          `/api/peminjaman-rekam-medis/update-status?id=${idRekamMedis}`,
          values
        ),
        {
          loading: 'Processing...',
          success: (res) => {
            setShowModalEditStatus(!showModalEditStatus);
            formik.resetForm();
            setRefresh((prev) => !prev);
            return res.data || 'Sukses Update Status Peminjaman';
          },
          error: (err) => {
            return err.response?.data?.error || 'Something went wrong';
          },
        }
      );
    },
  });

    const openModalEdit = async (id) => {
    setIdRekamMedis(id);
    setShowModalEdit(!showModalEdit);
    try {
      const res = await axios.get(
        `/api/peminjaman-rekam-medis/get-id?id=${id}`
      );
      formik.setFieldValue(
        'alasanPeminjaman',
        res.data.data.results.data.alasanPeminjaman
      );
      formik.setFieldValue(
        'tanggalDikembalikan',
        moment(res.data.data.results.data.tanggalDikembalikan).format(
          'YYYY-MM-DDTHH:mm'
        )
      );
      formik.setFieldValue(
        'tanggalPeminjaman',
        moment(res.data.data.results.data.tanggalPeminjaman).format(
          'YYYY-MM-DDTHH:mm'
        )
      );
      formik.setFieldValue('Dokter', res.data.data.results.data.Dokters.id);
      formik.setFieldValue(
        'RekamMedis',
        res.data.data.results.data.RiwayatPasiens.id
      );
      
      // Set selected rekam medis untuk edit
      const selectedRm = rekamMedisOptions.find(
        option => option.value === res.data.data.results.data.RiwayatPasiens.id
      );
      setSelectedEditRekamMedis(selectedRm);
    } catch (error) {}
  };

  const openModalEditStatus = async (idPeminjaman, idRekamMedis) => {
    setIdRekamMedis(idRekamMedis);
    setShowModalEditStatus(!showModalEditStatus);
    try {
      const res = await axios.get(
        `/api/peminjaman-rekam-medis/get-id?id=${idPeminjaman}`
      );
      console.log(res.data.data.results.data, 'resgetbyid');
      formStatus.setFieldValue(
        'statusPeminjaman',
        res.data.data.results.data.RiwayatPasiens.statusPeminjaman
      );
      formStatus.setFieldValue(
        'tanggalDikembalikan',
        moment(res.data.data.results.data.tanggalDikembalikan).format(
          'YYYY-MM-DDTHH:mm'
        )
      );
      formStatus.setFieldValue(
        'tanggalPeminjaman',
        moment(res.data.data.results.data.tanggalPeminjaman).format(
          'YYYY-MM-DDTHH:mm'
        )
      );
    } catch (error) {}
  };

  const openModalDelete = async (id) => {
    setIdRekamMedis(id);
    setShowModalDelete(!showModalDelete);
  };

  const deleteUser = async () => {
    try {
      await toast.promise(
        axios.delete(`/api/peminjaman-rekam-medis/delete?id=${idRekamMedis}`),
        {
          loading: 'Processing...',
          success: (res) => {
            setShowModalDelete(!showModalDelete);
            setRefresh((prev) => !prev);
            return res.response?.data?.message || 'Success Delete User';
          },
          error: (err) => {
            return err.response?.data?.error || 'Something went wrong';
          },
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataPeminjamanRekamMedis();
  }, [refresh]);

  return (
    <div>
      {contextHolder}

      <MetaHead title={'Peminjaman Rekam Medis | Puskesmas Ngasem'} />
      <Modal
        activeModal={showModalAdd}
        title={'Peminjaman Rekam Medis'}
        buttonClose={() => {
          setShowModalAdd(!showModalAdd);
          formik.resetForm();
        }}
        width={'1000px'}
        content={
          <>
            <form
              onSubmit={formik.handleSubmit}
              className="px-4 md:px-[100px] py-[20px] space-y-[20px]"
            >
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Dokter
                </h1>
                <select
                  name="Dokter"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Dokter}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                >
                  <option value="">Dokter yang ingin meminjam...</option>
                  {listDokter.map((item, idx) => (
                    <option key={idx} value={item.id}>
                      {item?.namaLengkap}
                    </option>
                  ))}
                </select>
                {formik.touched.Dokter && formik.errors.Dokter && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.Dokter}
                  </p>
                )}
              </div>
              <div className="w-full">
    <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
      Rekam Medis
    </h1>
    <Select
      name="RekamMedis"
      options={rekamMedisOptions}
      value={selectedRekamMedis}
      onChange={handleRekamMedisChange}
      onBlur={formik.handleBlur}
      placeholder="Cari rekam medis..."
      className="react-select-container"
      classNamePrefix="react-select"
      noOptionsMessage={() => "Tidak ada rekam medis yang ditemukan"}
      isSearchable
    />
    {formik.touched.RekamMedis && formik.errors.RekamMedis && (
      <p className="text-xs font-medium text-red-500 ml-1">
        * {formik.errors.RekamMedis}
      </p>
    )}
  </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Tanggal Peminjaman
                </h1>
                <input
                  name="tanggalPeminjaman"
                  type="datetime-local"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tanggalPeminjaman}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.tanggalPeminjaman &&
                  formik.errors.tanggalPeminjaman && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.tanggalPeminjaman}
                    </p>
                  )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Tanggal Dikembalikan
                </h1>
                <input
                  name="tanggalDikembalikan"
                  type="datetime-local"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tanggalDikembalikan}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.tanggalDikembalikan &&
                  formik.errors.tanggalDikembalikan && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.tanggalDikembalikan}
                    </p>
                  )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Alasan Peminjaman
                </h1>
                <textarea
                  name="alasanPeminjaman"
                  placeholder="Alasan Peminjaman..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.alasanPeminjaman}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.alasanPeminjaman &&
                  formik.errors.alasanPeminjaman && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.alasanPeminjaman}
                    </p>
                  )}
              </div>
            </form>
            <div className="flex items-center justify-end gap-[16px] py-[16px] px-4 md:px-[100px]">
              <button
                className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
                variant="secondary"
                onClick={() => {
                  setShowModalAdd(!showModalAdd);
                  formik.resetForm();
                }}
              >
                Batal
              </button>
              <button
                className="rounded-[5px] border bg-[#072B2E] py-[7px] px-[38px] text-white font-medium"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Tambah
              </button>
            </div>
          </>
        }
      />
      <Modal
        activeModal={showModalEdit}
        title={'Edit Peminjaman Rekam Medis'}
        buttonClose={() => {
          setShowModalEdit(!showModalEdit);
          formik.resetForm();
        }}
        width={'1000px'}
        content={
          <>
            <form
              onSubmit={formik.handleSubmit}
              className="px-4 md:px-[100px] py-[20px] space-y-[20px]"
            >
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Dokter
                </h1>
                <select
                  name="Dokter"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Dokter}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                >
                  <option value="">Dokter yang ingin meminjam...</option>
                  {listDokter.map((item, idx) => (
                    <option key={idx} value={item.id}>
                      {item?.namaLengkap}
                    </option>
                  ))}
                </select>
                {formik.touched.Dokter && formik.errors.Dokter && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.Dokter}
                  </p>
                )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Rekam Medis
                </h1>
                <Select
                  name="RekamMedis"
                  options={rekamMedisOptions}
                  value={selectedEditRekamMedis}
                  onChange={handleEditRekamMedisChange}
                  onBlur={formik.handleBlur}
                  placeholder="Cari rekam medis..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Tidak ada rekam medis yang ditemukan"}
                  isSearchable
                />
                {formik.touched.RekamMedis && formik.errors.RekamMedis && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.RekamMedis}
                  </p>
                )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Tanggal Peminjaman
                </h1>
                <input
                  name="tanggalPeminjaman"
                  type="datetime-local"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tanggalPeminjaman}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.tanggalPeminjaman &&
                  formik.errors.tanggalPeminjaman && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.tanggalPeminjaman}
                    </p>
                  )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Tanggal Dikembalikan
                </h1>
                <input
                  name="tanggalDikembalikan"
                  type="datetime-local"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tanggalDikembalikan}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.tanggalDikembalikan &&
                  formik.errors.tanggalDikembalikan && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.tanggalDikembalikan}
                    </p>
                  )}
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Alasan Peminjaman
                </h1>
                <textarea
                  name="alasanPeminjaman"
                  placeholder="Alasan Peminjaman..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.alasanPeminjaman}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.alasanPeminjaman &&
                  formik.errors.alasanPeminjaman && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.alasanPeminjaman}
                    </p>
                  )}
              </div>
            </form>
            <div className="flex items-center justify-end gap-[16px] py-[16px] px-4 md:px-[100px]">
              <button
                className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
                variant="secondary"
                onClick={() => {
                  setShowModalEdit(!showModalEdit);
                  formik.resetForm();
                }}
              >
                Batal
              </button>
              <button
                className="rounded-[5px] border bg-[#072B2E] py-[7px] px-[38px] text-white font-medium"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Simpan
              </button>
            </div>
          </>
        }
      />
      <Modal
        activeModal={showModalEditStatus}
        title={'Edit Status Peminjaman Rekam Medis'}
        buttonClose={() => setShowModalEditStatus(!showModalEditStatus)}
        width={'1000px'}
        content={
          <>
            <form
              onSubmit={formStatus.handleSubmit}
              className="px-4 md:px-[100px] py-[20px] space-y-[20px]"
            >
              <div className="w-full space-y-5">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Status
                  </h1>
                  <select
                    name="statusPeminjaman"
                    onChange={formStatus.handleChange}
                    onBlur={formStatus.handleBlur}
                    value={formStatus.values.statusPeminjaman}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  >
                    <option value="">Pilih Status...</option>
                    <option value="TERSEDIA">TERSEDIA</option>
                    <option value="DIPINJAM">DIPINJAM</option>
                    <option value="TERLAMBATDIKEMBALIKAN">
                      TERLAMBAT DIKEMBALIKAN
                    </option>
                  </select>
                  {formStatus.touched.statusPeminjaman &&
                    formStatus.errors.statusPeminjaman && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formStatus.errors.statusPeminjaman}
                      </p>
                    )}
                </div>
                {formStatus.values.statusPeminjaman === 'DIPINJAM' && (
                  <div className="w-full">
                    <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                      Tanggal Dikembalikan
                    </h1>
                    <input
                      name="tanggalDikembalikan"
                      onChange={formStatus.handleChange}
                      onBlur={formStatus.handleBlur}
                      type="datetime-local"
                      value={formStatus.values.tanggalDikembalikan}
                      className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                    />
                    {formStatus.touched.tanggalDikembalikan &&
                      formStatus.errors.tanggalDikembalikan && (
                        <p className="text-xs font-medium text-red-500 ml-1">
                          * {formStatus.errors.tanggalDikembalikan}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </form>
            <div className="flex items-center justify-end gap-[16px] py-[16px] px-4 md:px-[100px]">
              <button
                className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
                variant="secondary"
                onClick={() => setShowModalEditStatus(!showModalEditStatus)}
              >
                Batal
              </button>
              <button
                className="rounded-[5px] border bg-[#072B2E] py-[7px] px-[38px] text-white font-medium"
                type="submit"
                onClick={formStatus.handleSubmit}
              >
                Simpan
              </button>
            </div>
          </>
        }
      />
      <Navbar tittlePage={'Peminjaman Rekam Medis'} />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-3"
        >
          Cek Rekam Medis Terlambat
        </button>
        <button
          onClick={() => router.push('/peminjaman-rekam-medis/log-activity')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-3"
        >
          Buku Ekspedisi
        </button>
      </div>

      <div className="mb-10">
        <TablePagination
          data={dataPeminjamanRekamMedis}
          columns={kolomPeminjamanRekamMedis}
          fetchData={fetchDataPeminjamanRekamMedis}
          pagination={paginationPeminjamanRekamMedis}
          setSearch={setSearchPeminjamanRekamMedis}
          debouncedFetchData={debouncedFetchDataPeminjamanRekamMedis}
          showAddButton={true}
          tittleAddButton={'Peminjaman Baru'}
          actionAddButton={() => setShowModalAdd(!showModalAdd)}
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

  let dataRekamMedis = [];
  let dataDokter = [];
  let checkStatusData = { totalTerupdate: 0 };

  try {
    const res = await ClientRequest.GetRekamMedis(accessToken, '', 10000, 1);
    dataRekamMedis = res.data.results.data || [];
  } catch (error) {
    console.error('Error fetching Rekam Medis data');
  }

  try {
    const checkRes = await ClientRequest.CheckRekamMedisStatus(accessToken);
    checkStatusData = checkRes.data || { totalTerupdate: 0 };
  } catch (error) {
    console.error('Error fetching Rekam Medis data');
  }

  try {
    const res = await ClientRequest.GetDokter(accessToken, '', 10000, 1);
    dataDokter = res.data.results.data || [];
  } catch (error) {
    console.error('Error fetching dokter data');
  }

  return {
    props: {
      user,
      listRekamMedis: dataRekamMedis || [],
      listDokter: dataDokter || [],
      totalTerupdate: checkStatusData.totalTerupdate || 0,
    },
  };
});
