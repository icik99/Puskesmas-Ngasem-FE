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

        <table className="w-full border-collapse border-gray-300 mt-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                No. Rekam Medis
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.noRM || '-'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                Nama Pasien
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.namaPasien || '-'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Tanggal Kunjungan
              </td>
              <td className="border px-4 py-2">
                {moment(listRekamMedis.tanggalKunjungan).format('DD MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Dokter</td>
              <td className="border px-4 py-2">
                {listRekamMedis.namaDokter || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-lg font-semibold mt-6 mb-2">Keluhan Utama</h2>
        <table className="w-full border-collapse border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2">
                {listRekamMedis.subjektif || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-lg font-semibold mt-6 mb-2">Pemeriksaan</h2>
        <table className="w-full border-collapse border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                Keadaan Umum (KU)
              </td>
              <td className="border px-4 py-2">{listRekamMedis.ku || '-'}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Kondisi Tambahan (KT)
              </td>
              <td className="border px-4 py-2">{listRekamMedis.kt || '-'}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Tanda Vital</td>
              <td className="border px-4 py-2">
                {/* <p>Vital Sign Sensorium: {listRekamMedis.vitalSignSensorium || '-'}</p> */}
                <p>TD: {listRekamMedis.td || '-'}</p>
                <p>HR: {listRekamMedis.hr || '-'}</p>
                <p>RR: {listRekamMedis.rr || '-'}</p>
                <p>Suhu: {listRekamMedis.t || '-'}</p>
                <p>TB: {listRekamMedis.tb || '-'}</p>
                <p>BB: {listRekamMedis.bb || '-'}</p>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Pemeriksaan Fisik
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.pemeriksaanFisik || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-lg font-semibold mt-6 mb-2">Riwayat</h2>
        <table className="w-full border-collapse border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                Riwayat Penyakit Dahulu (RPD)
              </td>
              <td className="border px-4 py-2">{listRekamMedis.rpd || '-'}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Riwayat Pengobatan Obat (RPO)
              </td>
              <td className="border px-4 py-2">{listRekamMedis.rpo || '-'}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Riwayat Penyakit Keluarga (RPK)
              </td>
              <td className="border px-4 py-2">{listRekamMedis.rpk || '-'}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-lg font-semibold mt-6 mb-2">Diagnosa & Terapi</h2>
        <table className="w-full border-collapse border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                Diagnosa Penyakit
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.diagnosaPenyakit || '-'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Terapi</td>
              <td className="border px-4 py-2">
                {listRekamMedis.therapy || '-'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Evaluasi (ESO)</td>
              <td className="border px-4 py-2">{listRekamMedis.eso || '-'}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-lg font-semibold mt-6 mb-2">
          Rencana Tindak Lanjut
        </h2>
        <table className="w-full border-collapse border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/4">
                Pemeriksaan Penunjang
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.rencanaPemeriksaanPenunjang || '-'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Edukasi</td>
              <td className="border px-4 py-2">
                {listRekamMedis.rencanaEdukasi === 'POLAMAKAN' ? 'Pola Makan' : 'Pola Hidup'}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Rencana Rujukan
              </td>
              <td className="border px-4 py-2">
                {listRekamMedis.rencanaRujukan || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-end mt-8">
          <div className="text-center">
            <p>
              Ngasem, {moment(listRekamMedis?.createdAt).format('DD MMMM YYYY')}
            </p>
            <p>Dokter yang merawat:</p>
            <div className="mt-4">
              {listRekamMedis.ettd && (
                <Image
                  src={handleImage(listRekamMedis.ettd)}
                  width={150}
                  height={50}
                  alt="TTD Dokter"
                />
              )}
              <p className="mt-2 font-semibold">
                {listRekamMedis.namaDokter || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

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
    console.error('Error fetching RekamMedis data:', error);
  }

  return {
    props: {
      user,
      listRekamMedis: dataRekamMedis,
    },
  };
});
