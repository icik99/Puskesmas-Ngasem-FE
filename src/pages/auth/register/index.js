import Image from 'next/image';
import React, { useState } from 'react';
import bigLogo from '../../../../public/bigLogo.png';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import MetaHead from '@/components/MetaHead';

export default function Register() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      role: '',
      username: '',
      password: '',
      confirmPassword: '',
      archive: false,
    },
    validate: (values) => {
      const requiredFields = ['name', 'role', 'username', 'password'];
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
      return errors;
    },
    onSubmit: async (values) => {
      const { confirmPassword, ...newValues } = values;
      try {
        await toast.promise(axios.post('/api/auth/register', newValues), {
          loading: 'Processing...',
          success: (res) => {
            router.push('/auth/login');
            return (
              res.data || 'Success Register, please login to access the website'
            );
          },
          error: (err) => {
            return err.response?.data?.message || 'Something went wrong';
          },
        });
      } catch (error) {}
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-white">
      <MetaHead title={'Register | Admin'} />
      <div>
        <div className="mb-[33px]">
          <Image src={bigLogo} alt='Logo' />
        </div>
        <h1 className="text-center font-bold text-[#072B2E] text-[24px] mb-5">
          Register Account
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div className=" mb-[22px]">
              <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                Name
              </h1>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="name"
                type="text"
                className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                placeholder="Name..."
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs font-medium text-red-500 ml-1">
                  * {formik.errors.name}
                </p>
              )}
            </div>
            <div className="flex items-center gap-5">
              <div className=" mb-[22px] w-full">
                <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                  Username
                </h1>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="username"
                  type="text"
                  className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                  placeholder="Username..."
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.username}
                  </p>
                )}
              </div>
              <div className=" mb-[22px] w-full">
                <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                  Role
                </h1>
                <select
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="role"
                  type="text"
                  className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                  placeholder="Role..."
                >
                  <option value="">Select Role...</option>
                  <option value="admin">Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.role}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className=" mb-[22px] w-full">
                <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                  Password
                </h1>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                  type="password"
                  className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                  placeholder="Password..."
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    * {formik.errors.password}
                  </p>
                )}
              </div>
              <div className=" mb-[22px] w-full">
                <h1 className="text-[#072B2E] text-[16px] mb-[10px] font-medium">
                  Confirm Password
                </h1>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                  type="password"
                  className="px-[23px] py-[12px] rounded-[5px] border-2 outline-none w-full text-sm"
                  placeholder="Confirm Password..."
                />
              </div>
            </div>
          </div>
          <div className="w-full flex gap-5 justify-end">
            <button
              onClick={() => router.push('/auth/login')}
              type="submit"
              className="py-[10px] text-center text-[#072B2E] font-medium rounded-[5px] border border-[#072B2E] px-4"
            >
              Back to Login
            </button>
            <button
              onClick={formik.handleSubmit}
              type="submit"
              className="py-[10px] text-center text-white font-medium rounded-[5px] bg-[#072B2E] px-4"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
