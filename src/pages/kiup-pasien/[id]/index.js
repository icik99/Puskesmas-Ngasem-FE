import MetaHead from '@/components/MetaHead';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import React, { useRef } from 'react';
import bigLogo from '../../../../public/logo.png';
import Image from 'next/image';
import moment from 'moment';

export default function DetailPasien({ listPasien }) {
  const printRef = useRef(null);
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    // window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <MetaHead title={'Kartu Index Pasien | Puskesmas Ngasem'} />
    
    <div ref={printRef} className="print-content">
      <div className="w-[85.6mm] h-[73.98mm] border border-black p-[3mm] bg-white font-sans text-[7pt] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center border-b border-black pb-[1mm] mb-[1mm]">
          <div className="mr-[4mm]">
            <Image src={bigLogo} width={40} height={20} alt="Logo" />
          </div>
          <div className="text-center flex-1">
            <h2 className="text-[7pt] font-bold leading-tight m-0">PEMERINTAH KABUPATEN BOJONEGORO</h2>
            <h3 className="text-[6.5pt] font-bold leading-tight m-0">UPTD PUSKESMAS NGASEM</h3>
          </div>
        </div>
  
        {/* Title */}
        <div className="text-center mb-[1mm]">
          <h1 className="text-[8pt] font-bold underline m-0">KARTU BEROBAT PASIEN</h1>
        </div>
  
        {/* Content */}
        <div className="grid grid-cols-[26mm_auto] gap-y-[1mm] gap-x-[2mm]">
          <span className="font-bold">No. RM</span>
          <span>{listPasien?.nomerRM}</span>
  
          <span className="font-bold">No. BPJS/KIS</span>
          <span>{listPasien?.noBPJS_KIS}</span>
  
          <span className="font-bold">NIK</span>
          <span>{listPasien?.NIK}</span>
  
          <span className="font-bold">Nama</span>
          <span>{listPasien?.namaLengkap}</span>
  
          <span className="font-bold">Umur</span>
          <span>{listPasien?.usia} Tahun</span>
  
          <span className="font-bold">Alamat</span>
          <span>{listPasien?.kelurahan_desa}, {listPasien?.kecamatan}</span>
  
          <span className="font-bold">TTL</span>
          <span>{listPasien?.tempatLahir}, {moment(listPasien?.tanggalLahir).format('DD-MM-YYYY')}</span>
  
          <span className="font-bold">Jenis Kelamin</span>
          <span>{listPasien?.jenisKelamin}</span>
        </div>
      </div>
    </div>
  
    {/* Tombol Cetak */}
    <div className="flex justify-end mt-4 print:hidden">
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Cetak
      </button>
    </div>
  </div>
  
  );
}

export const getServerSideProps = withSession(async ({ req, query }) => {
  const accessToken = req.session?.auth?.access_token;
  const { id } = query;
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

  let dataPasien = {};

  try {
    const res = await ClientRequest.GetPatientById(accessToken, id);
    dataPasien = res.data.results.data || {};
  } catch (error) {
    console.error('Error fetching Pasien data');
  }

  return {
    props: {
      user,
      listPasien: dataPasien,
    },
  };
});
