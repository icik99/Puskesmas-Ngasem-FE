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
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidPencil } from 'react-icons/bi';
import { IoMdArchive } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

export default function UserManagement({ user }) {
  const {
    data: dataUserManagement,
    pagination: paginationUserManagement,
    fetchData: fetchDataUserManagement,
    setSearch: setSearchUserManagement,
    debouncedFetchData: debouncedFetchDataUserManagement,
  } = useFetchData('/api/user/get');
  const kolomUserManagement = [
    {
      header: 'No.',
      cell: (row) => (
        <h1>
          {toNumber(row.row.index) +
            1 +
            (paginationUserManagement.currentPage - 1) *
              paginationUserManagement.dataPerpages}
          .
        </h1>
      ),
    },
    { header: 'Nama', accessorKey: 'namaLengkap' },
    { header: 'Username', accessorKey: 'userName' },
    { header: 'Role', accessorKey: 'role' },
    {
      header: 'Action',
      cell: ({ row }) => (
        <>
          {
            <div className="flex items-center gap-2 justify-center">
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
                <MdDelete />
              </button>
            </div>
          }
        </>
      ),
    },
  ];
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isUserDokter, setIsUserDokter] = useState(false);
  const [idUser, setIdUser] = useState('');
  const [ttdImage, setTtdImage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const initialValues = isUserDokter
    ? {
        userName: '',
        password: '',
        confirmPassword: '',
        role: '',
        namaLengkap: '',
        noTelp: '',
        eTTD: '',
      }
    : {
        userName: '',
        password: '',
        confirmPassword: '',
        role: '',
        namaLengkap: '',
        noTelp: '',
      };
  const formik = useFormik({
    initialValues: initialValues,
    validate: (values) => {
      const requiredFields = [
        'userName',
        'password',
        'role',
        'namaLengkap',
        'noTelp',
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
      if (values.password !== values.confirmPassword) {
        errors.password = 'Password tidak sama';
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

      if (values.password && !passwordRegex.test(values.password)) {
        errors.password =
          'Password harus mengandung kombinasi huruf kapital dan angka';
      }
      const phoneRegex = /^\d+$/;
      if (values.phone && !phoneRegex.test(values.noTelp)) {
        errors.noTelp = 'Nomor telepon harus berupa angka';
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { confirmPassword, ...newValues } = values;
      if (showModalAdd) {
        try {
          await toast.promise(axios.post(`/api/user/post`, newValues), {
            loading: 'Processing...',
            success: (res) => {
              setShowModalAdd(!showModalAdd);
              formik.resetForm();
              setRefresh((prev) => !prev);
              return res.data || 'Success Create New User';
            },
            error: (err) => {
              return err.response?.data?.error || 'Something went wrong';
            },
          });
        } catch (error) {}
      } else {
        try {
          await toast.promise(
            axios.post(`/api/user/update?id=${idUser}`, newValues),
            {
              loading: 'Processing...',
              success: (res) => {
                setRefresh((prev) => !prev);
                setShowModalEdit(!showModalEdit);
                formik.resetForm();
                return res.data || 'Success Update User';
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

  const openModalEdit = async (id) => {
    setIdUser(id);
    setShowModalEdit(!showModalEdit);
    try {
      const res = await axios.get(`/api/user/get-id?id=${id}`);
      formik.setFieldValue(
        'namaLengkap',
        res.data.data.results.data.namaLengkap
      );
      formik.setFieldValue('noTelp', res.data.data.results.data.noTelp);
      formik.setFieldValue('userName', res.data.data.results.data.userName);
      formik.setFieldValue('password', res.data.data.results.data.password);
      formik.setFieldValue(
        'confirmPassword',
        res.data.data.results.data.password
      );
      formik.setFieldValue('role', res.data.data.results.data.role);
      if (res.data.data.results.data.role === 'DOKTER' || res.data.data.results.data.role === 'PETUGAS' || res.data.data.results.data.role === 'PERAWAT' || res.data.data.results.data.role === 'BIDAN') {
        setIsUserDokter(true);
        formik.setFieldValue('eTTD', res.data.data.results.data.eTTD);
        setTtdImage(handleImage(res.data.data.results.data.eTTD));
      } else {
        setIsUserDokter(false);
      }
    } catch (error) {}
  };

  const openModalDelete = async (id) => {
    setIdUser(id);
    setShowModalDelete(!showModalDelete);
  };

  const deleteUser = async () => {
    try {
      await toast.promise(axios.delete(`/api/user/delete?id=${idUser}`), {
        loading: 'Processing...',
        success: (res) => {
          setShowModalDelete(!showModalDelete);
          setRefresh((prev) => !prev);
          return res.response?.data?.message || 'Success Delete User';
        },
        error: (err) => {
          return err.response?.data?.error || 'Something went wrong';
        },
      });
    } catch (error) {}
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    formik.handleChange(e);
    setIsUserDokter(selectedRole === 'DOKTER' || selectedRole === 'PETUGAS' || selectedRole === 'PERAWAT' || selectedRole === 'BIDAN');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type !== 'image/png') {
      toast.error('File harus bertipe PNG.');
      return;
    }
    if (file && file.size > 1024 * 1024) {
      toast.error('Ukuran file maksimal 1 MB.');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('eTTD', reader.result);
        setTtdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchDataUserManagement();
  }, [refresh]);

  return (
    <div>
      <MetaHead title={'User Management | Puskesmas Ngasem'} />
      <Modal
        activeModal={showModalAdd}
        title={'Tambah User'}
        buttonClose={() => setShowModalAdd(!showModalAdd)}
        width={'1000px'}
        content={
          <>
            <div className="px-4 md:px-[100px] py-[20px] space-y-[20px]">
              <div className="flex flex-col md:flex-row md:gap-10">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nama Lengkap
                  </h1>
                  <input
                    name="namaLengkap"
                    placeholder="Nama Lengkap..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.namaLengkap}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched.namaLengkap && formik.errors.namaLengkap && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.namaLengkap}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nomor Telepon
                  </h1>
                  <input
                    name="noTelp"
                    placeholder="Nomor Telepon..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.noTelp}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched.noTelp && formik.errors.noTelp && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.noTelp}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Username
                </h1>
                <input
                  name="userName"
                  placeholder="Username..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.userName && formik.errors.userName && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.userName}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:gap-10">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Password
                  </h1>
                  <input
                    name="password"
                    placeholder="**********"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    type="password"
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm placeholder:font-semibold"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.password}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Confirm Password
                  </h1>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="**********"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm placeholder:font-semibold"
                  />
                </div>
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Role
                </h1>
                <select
                  name="role"
                  onChange={handleRoleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                >
                  <option value="">Select Role...</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="PETUGAS">PETUGAS</option>
                  <option value="DOKTER">DOKTER</option>
                  <option value="PERAWAT">PERAWAT</option>
                  <option value="BIDAN">BIDAN</option>
                  {user.role === 'SUPERADMIN' && (
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  )}
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.role}
                  </p>
                )}
              </div>
              {isUserDokter && (
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tanda Tangan
                  </h1>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded"
                  />
                  {ttdImage && (
                    <div className="mt-4">
                      <h2 className="font-medium text-sm mb-2">
                        Preview Tanda Tangan:
                      </h2>
                      <img
                        src={ttdImage}
                        loading="lazy"
                        alt="Preview Tanda Tangan"
                        className="max-w-md h-auto border rounded"
                      />
                    </div>
                  )}
                </div>
              )}
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
                Tambah
              </button>
            </div>
          </>
        }
      />
      <Modal
        activeModal={showModalEdit}
        title={'Edit User'}
        buttonClose={() => setShowModalEdit(!showModalEdit)}
        width={'1000px'}
        content={
          <>
            <div className="px-4 md:px-[100px] py-[20px] space-y-[20px]">
              <div className="flex flex-col md:flex-row md:gap-10">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nama Lengkap
                  </h1>
                  <input
                    name="namaLengkap"
                    placeholder="Nama Lengkap..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.namaLengkap}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched.namaLengkap && formik.errors.namaLengkap && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.namaLengkap}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Nomor Telepon
                  </h1>
                  <input
                    name="noTelp"
                    placeholder="Nomor Telepon..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.noTelp}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                  />
                  {formik.touched.noTelp && formik.errors.noTelp && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.noTelp}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Username
                </h1>
                <input
                  name="userName"
                  placeholder="Username..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                />
                {formik.touched.userName && formik.errors.userName && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.userName}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:gap-10">
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    New Password
                  </h1>
                  <input
                    name="password"
                    placeholder="**********"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    type="password"
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm placeholder:font-semibold"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      * {formik.errors.password}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Confirm New Password
                  </h1>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="**********"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm placeholder:font-semibold"
                  />
                </div>
              </div>
              <div className="w-full">
                <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                  Role
                </h1>
                <select
                  name="role"
                  onChange={handleRoleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
                >
                  <option value="">Select Role...</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="PETUGAS">PETUGAS</option>
                  <option value="DOKTER">DOKTER</option>
                  {user.role === 'SUPERADMIN' && (
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  )}
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.role}
                  </p>
                )}
              </div>
              {isUserDokter && (
                <div className="w-full">
                  <h1 className="font-medium text-[#B9B9B9] text-sm mb-[4px]">
                    Tanda Tangan Dokter
                  </h1>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded"
                  />
                  {ttdImage && (
                    <div className="mt-4">
                      <h2 className="font-medium text-sm mb-2">
                        Preview Tanda Tangan:
                      </h2>
                      <img
                        src={ttdImage}
                        loading="lazy"
                        alt="Preview Tanda Tangan"
                        className="max-w-md h-auto border rounded"
                      />
                    </div>
                  )}
                </div>
              )}
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
                Simpan
              </button>
            </div>
          </>
        }
      />
      <ModalDelete
        activeModal={showModalDelete}
        buttonClose={() => setShowModalDelete(!showModalDelete)}
        submitButton={deleteUser}
      />
      <Navbar tittlePage={'User Management'} />
      <div className="mb-10">
        <TablePagination
          data={dataUserManagement}
          columns={kolomUserManagement}
          fetchData={fetchDataUserManagement}
          pagination={paginationUserManagement}
          setSearch={setSearchUserManagement}
          debouncedFetchData={debouncedFetchDataUserManagement}
          showAddButton={true}
          tittleAddButton={'Tambah User'}
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

  return {
    props: {
      user,
    },
  };
});
