import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import smallLogo from '../../../public/logo.svg';
import { IoHome, IoMail } from 'react-icons/io5';
import Image from 'next/image';
import { FaMapMarked, FaUser } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi'; // Import burger icon

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [storedValue, setStoredValue] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Logout = async () => {
    toast.promise(
      axios.request({
        method: 'POST',
        url: '/api/auth/logout',
      }),
      {
        loading: 'Logging out...',
        success: (res) => {
          router.push('/auth/login');
          return res.data?.message;
        },
        error: (err) => {
          return err.data?.message;
        },
      }
    );
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem('role-ceisa');
      setStoredValue(value);
    }
  }, []);

  return (
    <>
      {/* Burger Icon for Mobile */}
      <div className="lg:hidden flex items-center p-4">
        <HiMenu className="text-3xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg z-50 lg:flex lg:flex-col py-8 border-r-2 border-b-2 min-h-full  max-h-full`}
      >
        <Link
          href={'/dashboard'}
          className="flex items-center justify-center mb-12"
        >
          <Image src={smallLogo} width={150} height={75} alt="Logo" />
        </Link>
        <div className="flex flex-col items-start mb-20 space-y-4">
          <Link
            href={'/dashboard'}
            className={`${router.pathname === '/dashboard' ? 'border-l-4 border-purple-300 font-medium' : ''} flex items-center gap-4 px-4 py-2 w-full hover:font-medium transition-colors duration-200`}
          >
            <IoHome className="text-2xl text-purple-300" />
            <h1 className={`text-sm`}>Dashboard</h1>
          </Link>
          <Link
            href={'/user-management'}
            className={`${router.pathname === '/user-management' ? 'border-l-4 border-purple-300 font-medium' : ''} flex items-center gap-4 px-4 py-2 w-full hover:font-medium transition-colors duration-200`}
          >
            <FaUser className="text-2xl text-purple-300" />
            <h1 className={`text-sm`}>User Management</h1>
          </Link>
          <Link
            href={'/province'}
            className={`${router.pathname === '/province' ? 'border-l-4 border-purple-300 font-medium' : ''} flex items-center gap-4 px-4 py-2 w-full hover:font-medium transition-colors duration-200`}
          >
            <FaMapMarked className="text-2xl text-purple-300" />
            <h1 className={`text-sm`}>Province</h1>
          </Link>
        </div>
        <button
          onClick={Logout}
          className="text-red-600 px-4 font-bold mt-auto"
        >
          Logout
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
