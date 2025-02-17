import MetaHead from '@/components/MetaHead';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import React, { useRef } from 'react';
import bigLogo from '../../../../public/logo.png';
import Image from 'next/image';
import moment from 'moment';
import handleImage from '@/utils/handleImage';

export default function DetailRekamMedis({ listRekamMedis }) {
  const printRef = useRef(null);

  // Fungsi untuk menangani pencetakan elemen tertentu
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div
      ref={printRef}
      id="printRekamMedis"
      className="max-w-full p-6 bg-white shadow-md rounded-lg print-content"
    >
      <MetaHead title={'Rekam Medis | Puskesmas Ngasem'} />
      <div className="">
        <div className="flex items-center justify-center gap-28">
          <div>
            <Image src={bigLogo} width={150} height={50} alt="Login" />
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
        <table className="w-full border-collapse  border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Nama Pasien</td>
              <td className="border px-4 py-2">{listRekamMedis.pasien}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">TTL</td>
              <td className="border px-4 py-2">{listRekamMedis.TTL}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Alamat</td>
              <td className="border px-4 py-2">{listRekamMedis.alamat}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Lama Penyakit</td>
              <td className="border px-4 py-2">
                {listRekamMedis.lamaPenyakit}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Hasil Pemeriksaan
              </td>
              <td className="border px-4 py-2">
                <p>Fisik: {listRekamMedis.fisik}</p>
                <p>Laboratorium: {listRekamMedis.laboratorium}</p>
                <p>Radiologi: {listRekamMedis.radiologi}</p>
                <p>Lain-lain: {listRekamMedis.lain_lainHasilPemeriksaan}</p>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Diagnosa Akhir</td>
              <td className="border px-4 py-2">
                {listRekamMedis.diagnosaAkhir}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Pengobatan/Tindakan
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.pengobatanTindakan}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Keadaan Waktu Keluar RS
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.keadaanKeluarRS}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Prognosa</td>
              <td className="border px-4 py-2">{listRekamMedis.prognosa}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Usul Tindak Lanjut
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.usulTidakLanjut}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center justify-end mt-5">
          <div>
            <p>
              Ngasem, {moment(listRekamMedis?.createdAt).format('DD MMMM YYYY')}
            </p>
            <p>Dokter yang merawat:</p>
            <Image
              src={handleImage(listRekamMedis?.ettd)}
              width={150}
              height={50}
              alt="TTD Dokter"
            />
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

  let dataRekamMedis = {};

  try {
    const res = await ClientRequest.GetRekamMedisById(accessToken, id);
    dataRekamMedis = res.data.results.data || {};
  } catch (error) {
    console.error('Error fetching RekamMedis data');
  }

  return {
    props: {
      user,
      listRekamMedis: dataRekamMedis,
    },
  };
});
