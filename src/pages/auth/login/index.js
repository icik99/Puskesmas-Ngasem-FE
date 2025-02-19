import Image from 'next/image';
import React from 'react';
import bigLogo from '../../../../public/logo.png';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import MetaHead from '../../../components/MetaHead';

export default function Login() {
  const router = useRouter();

  const formLogin = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.userName) {
        errors.userName = 'Username wajib diisi';
      }
      if (!values.password) {
        errors.password = 'Password wajib diisi';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await toast.promise(axios.post('/api/auth/login', values), {
          loading: 'Processing...',
          success: (res) => {
            localStorage.setItem('ROLE-PUSKESMAS-NGASEM', res.data.role);
            localStorage.setItem('NAME-PUSKESMAS-NGASEM', res.data.namaLengkap);
            router.push('/dashboard');
            return 'Success Login';
          },
          error: (err) => {
            console.log(err)
            return err.response?.data?.message || 'Something went wrong';
          },
        });
      } catch (error) {}
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center w-full ">
      <MetaHead title={'Login | Admin'} />
      <div>
        <div className="mb-[10px] flex justify-center">
          <Image src={bigLogo} width={200} height={100} alt="Login" />
        </div>
        <h1 className="text-xl font-medium mb-5 border-b-2 border-slate-600 pb-3">
          Sistem Informasi Rekam Medis Puskesmas Ngasem
        </h1>
        <form onSubmit={formLogin.handleSubmit}>
          <div>
            <div className=" mb-[22px]">
              <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                Username
              </h1>
              <input
                onChange={formLogin.handleChange}
                onBlur={formLogin.handleBlur}
                name="userName"
                type="text"
                className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                placeholder="Username..."
              />
              {formLogin.touched.userName && formLogin.errors.userName && (
                <p className="text-xs font-medium text-red-500 ml-1">
                  * {formLogin.errors.userName}
                </p>
              )}
            </div>
            <div className=" mb-[22px]">
              <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                Password
              </h1>
              <input
                onChange={formLogin.handleChange}
                onBlur={formLogin.handleBlur}
                name="password"
                type="password"
                className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                placeholder="Password..."
              />
              {formLogin.touched.password && formLogin.errors.password && (
                <p className="text-xs font-medium text-red-500 ml-1">
                  * {formLogin.errors.password}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              onClick={formLogin.handleSubmit}
              type="submit"
              className="py-[10px] text-center text-white font-medium rounded-[5px] bg-[#072B2E] w-[300px]"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
