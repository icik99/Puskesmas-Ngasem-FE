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
        <div className="flex items-center justify-start gap-28">
          <div>
            <Image src={bigLogo} width={150} height={50} alt="Logo" />
          </div>
          <div>
            <h1 className="text font-semibold text-center">
              Pemerintah Kabupaten Bojonegoro
            </h1>
            <h1 className="text font-semibold text-center">Dinas Kesehatan</h1>
            <h1 className="text font-semibold text-center">
              UPTD Puskesmas Ngasem
            </h1>
            <h1 className="text font-semibold text-center">
              Jl. Kadarusman No 306 Kec. Ngasem Kode Pos 62154
            </h1>
            <h1 className="text font-semibold text-center">
              Email: puskesmasngasem@yahoo.co.id
            </h1>
          </div>
        </div>
        <h1 className="text-2xl mb-10 font-semibold text-center border-y py-4">
          Kartu Berobat Pasien
        </h1>
        <table className="w-full -collapse  -gray-300">
          <tbody>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Nomer RM</td>
              <td className=" px-4 text-xl py-2">{listPasien?.nomerRM}</td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Nomer BPJS / KIS</td>
              <td className=" px-4 text-xl py-2">{listPasien?.noBPJS_KIS}</td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">NIK</td>
              <td className=" px-4 text-xl py-2">{listPasien?.NIK}</td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Nama Pasien</td>
              <td className=" px-4 text-xl py-2">{listPasien?.namaLengkap}</td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Umur</td>
              <td className=" px-4 text-xl py-2">{listPasien?.usia} Tahun</td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Alamat</td>
              <td className=" px-4 text-xl py-2">
                {listPasien?.kelurahan_desa}, {listPasien?.kecamatan},{' '}
                {listPasien?.kabupaten}
              </td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">TTL</td>
              <td className=" px-4 text-xl py-2">
                {listPasien?.tempatLahir}
                {', '}
                {moment(listPasien?.tanggalLahir).format('DD MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className=" px-4 text-xl py-2 font-semibold">Jenis Kelamin</td>
              <td className=" px-4 text-xl py-2">{listPasien?.jenisKelamin}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tombol Cetak */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cetak
        </button>
      </div>
      <style jsx>{`
        @media print {
          .print-content {
            display: block;
          }
          body * {
            display: none;
          }
          .print-content,
          .print-content * {
            display: block;
          }
        }
      `}</style>
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
