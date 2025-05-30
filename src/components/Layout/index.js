import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import smallLogo from '../../../public/logo.png';
import backgroundLogo from '../../../public/bg.png';
import { IoHome } from 'react-icons/io5';
import { FaBookMedical, FaMapMarked, FaUser } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosPeople, IoMdAnalytics } from 'react-icons/io';
import { MdOutlinePersonalInjury, MdPeopleOutline } from 'react-icons/md';
import { BsClipboard2DataFill } from 'react-icons/bs';

export default function Layout({ children }) {
  const router = useRouter();
  const isAuthRoute = router.pathname.includes('auth');
  const isHomePage = router.pathname === '/';
  const isNotFoundPage = router.pathname === '/404';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      const valueRole = localStorage.getItem('ROLE-PUSKESMAS-NGASEM');
      const valueName = localStorage.getItem('NAME-PUSKESMAS-NGASEM');

      setStoredValue({
        role: valueRole ? valueRole : '-',
        name: valueName ? valueName : '-',
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col ">
      {isAuthRoute ? (
        <div className="bg-white flex items-center justify-center min-h-screen">
          {children}
        </div>
      ) : (
        <div className="min-h-screen bg-blue-700 flex flex-col lg:flex-row w-full">
          {/* Sidebar */}
          <aside
            className={`fixed lg:relative inset-y-0 left-0 transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 bg-white shadow-lg lg:shadow-none border-r lg:min-h-screen lg:w-64 px-2`}
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center py-6 border-b lg:mb-8"
                >
                  <Image src={smallLogo} width={75} height={75} alt="Logo" />
                  <h1>PUSKESMAS NGASEM</h1>
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col flex-1 px-4 space-y-2">
                {[
                  {
                    href: '/dashboard',
                    label: 'Dashboard',
                    icon: <IoHome className="text-2xl text-blue-700" />,
                  },
                  {
                    href: '/pendaftaran',
                    label: 'Pendaftaran',
                    icon: (
                      <MdOutlinePersonalInjury className="text-3xl text-blue-700" />
                    ),
                  },
                  {
                    href: '/kiup-pasien',
                    label: 'KIUP Pasien',
                    icon: (
                      <MdPeopleOutline  className="text-3xl text-blue-700" />
                    ),
                  },
                  ...(storedValue?.role === 'ADMIN' ||
                  storedValue?.role === 'PETUGAS'
                    ? [
                        {
                          href: '/peminjaman-rekam-medis',
                          label: 'Peminjaman Rekam Medis',
                          icon: (
                            <FaBookMedical className="text-3xl text-blue-700" />
                          ),
                        },
                      ]
                    : []),
                  {
                    href: '/user-management',
                    label: 'User',
                    icon: <FaUser className="text-2xl text-blue-700" />,
                  },
                  {
                    href: '/analisis-rekam-medis',
                    label: 'Analisis RM',
                    icon: <IoMdAnalytics className="text-2xl text-blue-700" />,
                  },
                  {
                    href: '/rekap-data',
                    label: 'Rekap Data',
                    icon: (
                      <BsClipboard2DataFill className="text-2xl text-blue-700" />
                    ),
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'border-l-4 border-blue-700 font-medium bg-blue-50'
                        : 'hover:bg-gray-100'
                    } flex items-center gap-3 px-4 py-3 w-full rounded-md transition duration-200`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="px-4 py-6 border-t">
                <button
                  onClick={Logout}
                  className="text-red-600 font-bold w-full text-left hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          <main className="flex-1 flex flex-col transition-all duration-300 lg:ml-0 px-4 lg:px-6 py-4">
            <header className="lg:hidden flex items-center p-4 bg-white shadow-md rounded">
              <HiMenu
                className="text-3xl cursor-pointer text-gray-700"
                onClick={toggleSidebar}
              />
            </header>

            <div className="flex-1 bg-white shadow-md rounded-lg mt-4 p-4 lg:p-6 relative overflow-hidden">
             <Image
                src={backgroundLogo}
                alt="Watermark"
                className="absolute top-1/2 left-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 opacity-10 h-screen object-fill  pointer-events-none select-none"
              />

              {children}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
