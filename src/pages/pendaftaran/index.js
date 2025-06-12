import MetaHead from '@/components/MetaHead';
import Modal from '@/components/Modal';
import ModalDelete from '@/components/ModalDelete';
import Navbar from '@/components/Navbar';
import Table from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import useFetchData from '@/hooks/useFetchData';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import axios from 'axios';
import { useFormik } from 'formik';
import { toNumber } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidPencil } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { IoEye } from 'react-icons/io5';
export default function Pendaftaran({ user }) {
  const {
    data: dataPatient,
    pagination: paginationPatient,
    fetchData: fetchDataPatient,
    setSearch: setSearchPatient,
    debouncedFetchData: debouncedFetchDataPatient,
  } = useFetchData('/api/patient/get');
  const kolomPasien = [
    {
      header: 'No.',
      cell: (row) => (
        <h1>
          {toNumber(row.row.index) +
            1 +
            (paginationPatient.currentPage - 1) *
              paginationPatient.dataPerpages}
          .
        </h1>
      ),
    },
    { header: 'No. RM', accessorKey: 'nomerRM' },
    { header: 'No. BPJS / KIS', accessorKey: 'noBPJS_KIS' },
    { header: 'NIK', accessorKey: 'NIK' },
    { header: 'Nama Lengkap', accessorKey: 'namaLengkap' },
    { header: 'Jenis Kelamin', accessorKey: 'jenisKelamin' },
    { header: 'Tempat Tanggal Lahir', accessorKey: 'TTL' },
    {
      header: 'Umur',
      accessorKey: 'usia',
      cell: ({ row }) => <p>{row.original.usia} Tahun</p>,
    },
    { header: 'Alamat', accessorKey: 'alamat' },
    {
      header: 'Aksi',
      cell: ({ row }) => (
        <>
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => openModalDetail(row.original.id)}
              className="text-xl text-[#072B2E]"
            >
              <IoEye />
            </button>
            <button
              onClick={() => openModalEdit(row.original.id)}
              className="text-xl text-[#072B2E]"
            >
              <BiSolidPencil />
            </button>
            <button
              onClick={() => openModalDelete(row.original.id)}
              className="text-xl text-[#072B2E]"
            >
              <FaTrashAlt />
            </button>
          </div>
        </>
      ),
    },
  ];
  const kolomRekamMedisPasien = [
    {
      header: 'No.',
      cell: (row) => (
        <h1>
          {toNumber(row.row.index) +
            1 +
            (paginationPatient.currentPage - 1) *
              paginationPatient.dataPerpages}
          .
        </h1>
      ),
    },
    {
      header: 'Tanggal Kunjungan',
      accessorKey: 'tanggalKunjungan',
      cell: ({ row }) => (
        <p>{moment(row.original.tanggalKunjungan).format('DD-MM-YYYY')}</p>
      ),
    },
    { header: 'Keluhan', accessorKey: 'subjektif' },
    { header: 'Diagnosa Penyakit', accessorKey: 'diagnosaPenyakit' },
    {
      header: 'Catatan Keperawatan',
      accessorKey: 'catatanKeperewatan',
    },
    {
      header: 'Aksi',
      cell: ({ row }) => (
        <>
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => router.push(`/rekam-medis/${row.original.id}`)}
              className="text-xl text-[#072B2E]"
            >
              <IoEye />
            </button>
          </div>
        </>
      ),
    },
  ];
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [dataRekamMedisPasien, setDataRekamMedisPasien] = useState([]);
  const [dataDetailPatient, setDataDetailPatient] = useState({});
  const [idPasien, setIdPasien] = useState('');
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      namaPasien: '-',
      namaLengkap: '',
      jenisKelamin: '',
      tanggalLahir: '',
      tempatLahir: '',
      noBPJS_KIS: '',
      kecamatan: '',
      kelurahan_desa: '',
      kodeWilayah: '',
      NIK: '',
      usia: '',
      kabupaten: '',
      riwayatAlergi: '',
      riwayatPenyakit: '',
    },
    validate: (values) => {
      const requiredFields = [
        'namaPasien',
        'namaLengkap',
        'jenisKelamin',
        'tanggalLahir',
        'tempatLahir',
        'noBPJS_KIS',
        'kecamatan',
        'kelurahan_desa',
        'NIK',
        'usia',
        'kabupaten',
        'riwayatAlergi',
        'riwayatPenyakit',
      ];

      const errors = {};

      requiredFields.forEach((field) => {
        if (!values[field]) {
          errors[field] = `Field ${field} wajib diisi`;
        }
      });
      // Validasi khusus untuk NIK
      if (values.NIK && !/^\d+$/.test(values.NIK)) {
        errors.NIK = 'Field NIK harus berupa angka';
      }


      return errors;
    },
    onSubmit: async (values) => {
      values.tanggalLahir = moment(values.tanggalLahir).format('MM-DD-YYYY');
      if (showModalAdd) {
        try {
          await toast.promise(axios.post(`/api/patient/create`, values), {
            loading: 'Processing...',
            success: (res) => {
              setRefresh((prev) => !prev);
              setShowModalAdd(!showModalAdd);
              formik.resetForm();
              return res.data || 'Berhasil Membuat Pasien Baru';
            },
            error: (err) => {
              return err.response?.data?.error || 'Something went wrong';
            },
          });
        } catch (error) {
          console.error('Submission error:', error);
        }
      } else {
        try {
          await toast.promise(
            axios.post(`/api/patient/update?id=${idPasien}`, values),
            {
              loading: 'Processing...',
              success: (res) => {
                setRefresh((prev) => !prev);
                setShowModalEdit(!showModalEdit);
                formik.resetForm();
                return res.data || 'Berhasil Memperbarui Data Pasien';
              },
              error: (err) => {
                return err.response?.data?.error || 'Something went wrong';
              },
            }
          );
        } catch (error) {
          console.error('Submission error:', error);
        }
      }
    },
  });

  const openModalEdit = async (id) => {
    setIdPasien(id);
    setShowModalEdit(!showModalEdit);
    try {
      const res = await axios.get(`/api/patient/get-id?id=${id}`);
      const fieldsToUpdate = [
        'namaPasien',
        'namaLengkap',
        'jenisKelamin',
        'tanggalLahir',
        'tempatLahir',
        'noBPJS_KIS',
        'kecamatan',
        'kelurahan_desa',
        'NIK',
        'usia',
        'kabupaten',
        'riwayatAlergi',
        'riwayatPenyakit',
      ];

      fieldsToUpdate.forEach((field) => {
        formik.setFieldValue(field, res.data?.data?.results?.data?.[field]);
      });
    } catch (error) {}
  };

  const openModalDetail = async (id) => {
    setShowModalDetail(!showModalDetail);
    try {
      const res = await axios.get(`/api/patient/get-id?id=${id}`);
      setDataRekamMedisPasien(res.data.data.results.data.RiwayatPasiens);
      setDataDetailPatient(res.data.data.results.data);
    } catch (error) {}
  };

  const openModalDelete = async (id) => {
    setIdPasien(id);
    setShowModalDelete(!showModalDelete);
  };

  const deletePatient = async () => {
    try {
      await toast.promise(axios.delete(`/api/patient/delete?id=${idPasien}`), {
        loading: 'Processing...',
        success: (res) => {
          setShowModalDelete(!showModalDelete);
          setRefresh((prev) => !prev);
          return res.response?.data?.message || 'Berhasil Menghapus Pasien';
        },
        error: (err) => {
          return err.response?.data?.error || 'Something went wrong';
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataPatient();
  }, [refresh]);

  return (
    <div>
      <MetaHead title={'Pendaftaran | Puskesmas Ngasem'} />
      <Modal
        activeModal={showModalDetail}
        title={'Detail Pasien'}
        buttonClose={() => setShowModalDetail(!showModalDetail)}
        width={'1000px'}
        content={
          <>
            <div className="mx-4 md:mx-[100px] my-[20px] space-y-[20px]">
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                Biodata Pasien
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nama Lengkap
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.namaLengkap}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px] md:text-end">
                    NIK
                  </h1>
                  <h1 className="text-base text-black font-medium md:text-end">
                    {dataDetailPatient?.NIK}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nomor BPJS / KIS
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.noBPJS_KIS}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px] md:text-end">
                    Tempat, Tanggal Lahir
                  </h1>
                  <h1 className="text-base text-black font-medium md:text-end">
                    {dataDetailPatient?.tempatLahir},{' '}
                    {moment(dataDetailPatient?.tanggalLahir).format(
                      'DD MMMM YYYY'
                    )}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Usia
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.usia} Tahun
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px] sm:text-end">
                    Nomor Rekam Medis
                  </h1>
                  <h1 className="text-base text-black font-medium md:text-end">
                    {dataDetailPatient?.nomerRM}
                  </h1>
                </div>
              </div>
              <h1 className="mb-3 font-semibold text-lg border-b-2">Alamat</h1>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kelurahan/Desa
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.kelurahan_desa}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kecamatan
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.kecamatan}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kabupaten
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.kabupaten}
                  </h1>
                </div>
              </div>
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                Riwayat Penyakit dan Alergi
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Riwayat Alergi
                  </h1>
                  <h1 className="text-base text-black font-medium">
                    {dataDetailPatient?.riwayatAlergi}
                  </h1>
                </div>
                <div>
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px] md:text-end">
                    Riwayat Penyakit
                  </h1>
                  <h1 className="text-base text-black font-medium md:text-end">
                    {dataDetailPatient?.riwayatPenyakit}
                  </h1>
                </div>cz
              </div>
              
              <div className='flex items-center justify-between border-b-2'>
                <h1 className="mb-3 font-semibold text-lg">
                  Riwayat Berobat / Rekam Medis
                </h1>
                <button onClick={() => router.push(`/rekam-medis?idPasien=${dataDetailPatient.id}`)} className='underline font-semibold'>Tambah Rekam Medis</button>
              </div>

              <div className="mb-10">
                <Table
                  data={dataRekamMedisPasien}
                  columns={kolomRekamMedisPasien}
                />
              </div>

              <div className="flex items-center justify-end gap-[16px] py-[16px]">
                <button
                  className="rounded-[5px] border border-blue-700 py-[7px] px-[38px] text-black font-medium"
                  variant="secondary"
                  onClick={() => setShowModalDetail(!showModalDetail)}
                >
                  Tutup
                </button>
                <button
                  className="rounded-[5px] border bg-blue-700 py-[7px] px-[38px] text-white font-medium"
                  variant="secondary"
                  onClick={() =>
                    router.push(`/pendaftaran/${dataDetailPatient?.id}`)
                  }
                >
                  Cetak KIB
                </button>
              </div>
            </div>
          </>
        }
      />
      <Modal
        activeModal={showModalEdit}
        title={'Edit Pasien'}
        buttonClose={() => setShowModalEdit(!showModalEdit)}
        width={'1000px'}
        content={
          <>
            <div className="px-4 md:px-[100px] py-[20px] space-y-[20px]">
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                Biodata Pasien
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nama Lengkap
                  </h1>
                  <input
                    name="namaLengkap"
                    placeholder="Nama Lengkap..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.namaLengkap}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.namaLengkap &&
                    formik.errors?.namaLengkap && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.namaLengkap}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Jenis Kelamin
                  </h1>
                  <select
                    name="jenisKelamin"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.jenisKelamin}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  >
                    <option value="">Select Jenis Kelamin...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {formik.touched.jenisKelamin &&
                    formik.errors.jenisKelamin && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors.jenisKelamin}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    NIK
                  </h1>
                  <input
                    name="NIK"
                    placeholder="NIK..."
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.NIK}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.NIK && formik.errors?.NIK && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.NIK}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nomor BPJS / KIS
                  </h1>
                  <input
                    name="noBPJS_KIS"
                    placeholder="Nomor BPJS / KIS..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.noBPJS_KIS}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.noBPJS_KIS && formik.errors?.noBPJS_KIS && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.noBPJS_KIS}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tempat Lahir
                  </h1>
                  <input
                    name="tempatLahir"
                    placeholder="Tempat Lahir..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.tempatLahir}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.tempatLahir &&
                    formik.errors?.tempatLahir && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.tempatLahir}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tanggal Lahir
                  </h1>
                  <input
                    name="tanggalLahir"
                    type="date"
                    placeholder="Tanggal Lahir..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.tanggalLahir}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.tanggalLahir &&
                    formik.errors?.tanggalLahir && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.tanggalLahir}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Usia
                  </h1>
                  <input
                    name="usia"
                    placeholder="Usia..."
                    onChange={formik.handleChange}
                    type="number"
                    onBlur={formik.handleBlur}
                    value={formik?.values?.usia}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.usia && formik.errors?.usia && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.usia}
                    </p>
                  )}
                </div>
              </div>
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                {' '}
                Alamat{' '}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kelurahan / Desa
                  </h1>
                  <input
                    name="kelurahan_desa"
                    placeholder="Kelurahan / Desa..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kelurahan_desa}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kelurahan_desa &&
                    formik.errors?.kelurahan_desa && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.kelurahan_desa}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kecamatan
                  </h1>
                  <input
                    name="kecamatan"
                    placeholder="Kecamatan..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kecamatan}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kecamatan && formik.errors?.kecamatan && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.kecamatan}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kabupaten
                  </h1>
                  <input
                    name="kabupaten"
                    placeholder="Kabupaten..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kabupaten}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kabupaten && formik.errors?.kabupaten && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.kabupaten}
                    </p>
                  )}
                </div>
              </div>

              <h1 className="mb-3 font-semibold text-lg border-b-2">
                {' '}
                Riwayat Penyakit dan Alergi{' '}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Riwayat Penyakit
                  </h1>
                  <textarea
                    name="riwayatPenyakit"
                    placeholder="Riwayat Penyakit..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.riwayatPenyakit}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.riwayatPenyakit &&
                    formik.errors?.riwayatPenyakit && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.riwayatPenyakit}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Riwayat Alergi
                  </h1>
                  <textarea
                    name="riwayatAlergi"
                    placeholder="Riwayat Alergi..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.riwayatAlergi}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.riwayatAlergi &&
                    formik.errors?.riwayatAlergi && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.riwayatAlergi}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-[16px] py-[16px] px-4 md:px-[100px]">
              <button
                className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
                variant="secondary"
                onClick={() => setShowModalEdit(!showModalEdit)}
              >
                Batal
              </button>
              <button
                className="rounded-[5px] border bg-[#072B2E] py-[7px] px-[38px] text-white font-medium"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Edit
              </button>
            </div>
          </>
        }
      />
      <Modal
        activeModal={showModalAdd}
        title={'Tambah Pasien'}
        buttonClose={() => setShowModalAdd(!showModalAdd)}
        width={'1000px'}
        content={
          <>
            <div className="px-4 md:px-[100px] py-[20px] space-y-[20px]">
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                Biodata Pasien
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kode Wilayah
                  </h1>
                  <select
                    name="kodeWilayah"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kodeWilayah}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  >
                    <option value="">Pilih Kode Wilayah...</option>
                    <option value="01">01 - Desa Ngasem</option>
                    <option value="02">02 - Desa Sendangharjo</option>
                    <option value="03">03 - Desa Ngadiluwih</option>
                    <option value="04">04 - Desa Kolong</option>
                    <option value="05">05 - Desa Butoh</option>
                    <option value="06">06 - Desa Trenggulunan </option>
                    <option value="07">07 - Desa Setren</option>
                    <option value="08">08 - Desa Mediyunan</option>
                    <option value="09">09 - Desa Bandungrejo</option>
                    <option value="10">10 - Desa Dukohkidul</option>
                    <option value="11">11 - Desa Jampet</option>
                    <option value="12">12 - Desa Tengger</option>
                    <option value="13">13 - Desa Ngantru</option>
                    <option value="14">14 - Desa Bareng</option>
                    <option value="15">15 - Desa Wadang</option>
                    <option value="16">16 - Desa Sambong</option>
                    <option value="17">17 - Desa Jelu</option>
                    <option value="18">18 - Luar Wilayah</option>
                  </select>
                  {formik.touched.kodeWilayah &&
                    formik.errors.kodeWilayah && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors.kodeWilayah}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nama Lengkap
                  </h1>
                  <input
                    name="namaLengkap"
                    placeholder="Nama Lengkap..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.namaLengkap}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.namaLengkap &&
                    formik.errors?.namaLengkap && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.namaLengkap}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Jenis Kelamin
                  </h1>
                  <select
                    name="jenisKelamin"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.jenisKelamin}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  >
                    <option value="">Select Jenis Kelamin...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {formik.touched.jenisKelamin &&
                    formik.errors.jenisKelamin && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors.jenisKelamin}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    NIK
                  </h1>
                  <input
                    name="NIK"
                    type="text"
                    placeholder="NIK..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.NIK}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.NIK && formik.errors?.NIK && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.NIK}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nomor BPJS / KIS
                  </h1>
                  <input
                    name="noBPJS_KIS"
                    placeholder="Nomor BPJS / KIS..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.noBPJS_KIS}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.noBPJS_KIS && formik.errors?.noBPJS_KIS && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.noBPJS_KIS}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tempat Lahir
                  </h1>
                  <input
                    name="tempatLahir"
                    placeholder="Tempat Lahir..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.tempatLahir}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.tempatLahir &&
                    formik.errors?.tempatLahir && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.tempatLahir}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tanggal Lahir
                  </h1>
                  <input
                    name="tanggalLahir"
                    type="date"
                    placeholder="Tanggal Lahir..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.tanggalLahir}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.tanggalLahir &&
                    formik.errors?.tanggalLahir && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.tanggalLahir}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Usia
                  </h1>
                  <input
                    name="usia"
                    placeholder="Usia..."
                    onChange={formik.handleChange}
                    type="number"
                    onBlur={formik.handleBlur}
                    value={formik?.values?.usia}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.usia && formik.errors?.usia && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.usia}
                    </p>
                  )}
                </div>
              </div>
              <h1 className="mb-3 font-semibold text-lg border-b-2">
                {' '}
                Alamat{' '}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kelurahan / Desa
                  </h1>
                  <input
                    name="kelurahan_desa"
                    placeholder="Kelurahan / Desa..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kelurahan_desa}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kelurahan_desa &&
                    formik.errors?.kelurahan_desa && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.kelurahan_desa}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kecamatan
                  </h1>
                  <input
                    name="kecamatan"
                    placeholder="Kecamatan..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kecamatan}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kecamatan && formik.errors?.kecamatan && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.kecamatan}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Kabupaten
                  </h1>
                  <input
                    name="kabupaten"
                    placeholder="Kabupaten..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.kabupaten}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.kabupaten && formik.errors?.kabupaten && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors?.kabupaten}
                    </p>
                  )}
                </div>
              </div>

              <h1 className="mb-3 font-semibold text-lg border-b-2">
                {' '}
                Riwayat Penyakit dan Alergi{' '}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Riwayat Penyakit
                  </h1>
                  <textarea
                    name="riwayatPenyakit"
                    placeholder="Riwayat Penyakit..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.riwayatPenyakit}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.riwayatPenyakit &&
                    formik.errors?.riwayatPenyakit && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.riwayatPenyakit}
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Riwayat Alergi
                  </h1>
                  <textarea
                    name="riwayatAlergi"
                    placeholder="Riwayat Alergi..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik?.values?.riwayatAlergi}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched?.riwayatAlergi &&
                    formik.errors?.riwayatAlergi && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        * {formik.errors?.riwayatAlergi}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-[16px] py-[16px] px-4 md:px-[100px]">
              <button
                className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
                variant="secondary"
                onClick={() => setShowModalAdd(!showModalAdd)}
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
      <ModalDelete
        activeModal={showModalDelete}
        buttonClose={() => setShowModalDelete(!showModalDelete)}
        submitButton={deletePatient}
      />
      <Navbar
        tittlePage={'Pendaftaran'}
        subTittlePage={'Pendaftaran Pasien dan Pembuatan Rekam Medis'}
      />
      {(user.role !== 'DOKTER' || user.role !== 'PERAWAT' || user.role !== 'BIDAN') && (
        <button
          onClick={() => router.push('/rekam-medis')}
          className="bg-[#072B2E] text-white font-semibold rounded-[5px] py-[6px] px-[15px] mb-3"
        >
          Tambah Rekam Medis
        </button>
      )}
      <div className="mb-10">
        <TablePagination
          data={dataPatient}
          columns={kolomPasien}
          fetchData={fetchDataPatient}
          pagination={paginationPatient}
          setSearch={setSearchPatient}
          debouncedFetchData={debouncedFetchDataPatient}
          showSearchBar={true}
          showAddButton={true}
          tittleAddButton={
            user.role === 'PETUGAS' || user.role === 'ADMIN'
              ? 'Tambah Pasien Baru'
              : 'Tambah Rekam Medis'
          }
          actionAddButton={
            user.role !== 'DOKTER' || user.role !== 'PERAWAT'|| user.role !== 'BIDAN' 
              ? () => setShowModalAdd(!showModalAdd)
              : () => router.push('/rekam-medis')
          }
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

  // let dataProvinsi = [];
  // let dataProfile = [];

  // try {
  //   const res = await ClientRequest.GetProvince(accessToken, "", 10000, 1);
  //   dataProvinsi = res.data.data || [];
  // } catch (error) {
  //   console.error("Error fetching province data");
  // }

  // try {
  //   const res = await ClientRequest.GetProfile(accessToken);
  //   dataProfile = res.data || [];
  // } catch (error) {
  //   console.error("Error fetching province data");
  // }

  return {
    props: {
      user,
      // listProvinsi: dataProvinsi || [],
      // listProfile: dataProfile || [],
    },
  };
});
