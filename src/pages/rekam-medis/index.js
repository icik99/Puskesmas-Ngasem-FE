import MetaHead from '@/components/MetaHead';
import Navbar from '@/components/Navbar';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import axios from 'axios';
import { useFormik } from 'formik';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Create({
  listPasien,
  user,
  listDokter,
  listRekamMedis,
}) {
  console.log(listRekamMedis)
  const router = useRouter();
  const idRekamMedis = router.query.id;
  const idPasien = router.query.idPasien;
  const formik = useFormik({
    initialValues: {
      Dokter:
        user.role === 'DOKTER' && !idRekamMedis
          ? user.id
          : listRekamMedis.Dokter,
      pasien: !idRekamMedis ? idPasien : listRekamMedis.pasien,
      noRM: !idRekamMedis ? null : listRekamMedis.noRM,
      tanggalKunjungan: !idRekamMedis ? null : listRekamMedis.tanggalKunjungan,
      subjektif: !idRekamMedis ? null : listRekamMedis.subjektif,
      ku: !idRekamMedis ? null : listRekamMedis.ku,
      kt: !idRekamMedis ? null : listRekamMedis.kt,
      rpd: !idRekamMedis ? null : listRekamMedis.rpd,
      rpo: !idRekamMedis ? null : listRekamMedis.rpo,
      rpk: !idRekamMedis ? null : listRekamMedis.rpk,
      td: !idRekamMedis ? null : listRekamMedis.td,
      hr: !idRekamMedis ? null : listRekamMedis.hr,
      rr: !idRekamMedis ? null : listRekamMedis.rr,
      t: !idRekamMedis ? null : listRekamMedis.t,
      tb: !idRekamMedis ? null : listRekamMedis.tb,
      bb: !idRekamMedis ? null : listRekamMedis.bb,
      pemeriksaanFisik: !idRekamMedis ? null : listRekamMedis.pemeriksaanFisik,
      catatanKeperawatan: !idRekamMedis
        ? null
        : listRekamMedis.catatanKeperawatan,
      diagnosaPenyakit: !idRekamMedis ? null : listRekamMedis.diagnosaPenyakit,
      therapy: !idRekamMedis ? null : listRekamMedis.therapy,
      eso: !idRekamMedis ? null : listRekamMedis.eso,
      rencanaPemeriksaanPenunjang: !idRekamMedis
        ? null
        : listRekamMedis.rencanaPemeriksaanPenunjang,
      Edukasi: !idRekamMedis ? null : listRekamMedis.Edukasi,
      rencanaRujukan: !idRekamMedis ? null : listRekamMedis.rencanaRujukan,
      vitalSignSensorium: !idRekamMedis ? null : listRekamMedis.vitalSignSensorium,
    },
    onSubmit: async (values) => {
      if (!idRekamMedis) {
        try {
          await toast.promise(axios.post(`/api/rekam-medis/create`, values), {
            loading: 'Processing...',
            success: (res) => {
              formik.resetForm();
              router.push('/pendaftaran');
              return res.data || 'Berhasil Membuat Rekam Medis';
            },
            error: (err) => {
              console.log(err);
              return 'Something went wrong';
            },
          });
        } catch (error) {
          console.error('Submission error:', error);
        }
      } else {
        try {
          await toast.promise(
            axios.post(`/api/rekam-medis/update?id=${idRekamMedis}`, values),
            {
              loading: 'Processing...',
              success: (res) => {
                router.push('/analisis-rekam-medis');
                return res.data || 'Berhasil Memperbarui Data Rekam Medis';
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

  useEffect(() => {
    if (formik.values.pasien) {
      const selectedPasien = listPasien.find(
        (pasien) => pasien.id === formik.values.pasien
      );
      if (selectedPasien) {
        formik.setFieldValue('noRM', selectedPasien.nomerRM);
      }
    }
  }, [formik.values.pasien]);

  return (
    <div>
      <MetaHead title={'Rekam Medis | Puskesmas Ngasem'} />
      <Navbar tittlePage={'Rekam Medis'} />
      <div className="w-full font-medium text-red-500">
        Semua kolom input disarankan untuk diisi. Tetapi jika ada bagian yang
        tidak ingin / tidak perlu diisi, silakan biarkan field tersebut kosong.
      </div>
      <section>
        <div className="py-[20px] space-y-[20px]">
          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Dokter yang Bertugas
          </h1>
          <div className="w-full">
            <select
              name="Dokter"
              disabled={user.role === 'DOKTER' ? true : false}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Dokter}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            >
              <option value="">Select Dokter...</option>
              {listDokter.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.namaLengkap}
                </option>
              ))}
            </select>
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">Pasien</h1>
          <div className="w-full">
            <select
              name="pasien"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pasien}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            >
              <option value="">Select Pasien...</option>
              {listPasien.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.namaLengkap}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <input
              name="noRM"
              placeholder="Nomor RM..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.noRM}
              disabled
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Tanggal Kunjungan
          </h1>
          <div className="w-full">
            <input
              type="date"
              name="tanggalKunjungan"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={moment(formik.values.tanggalKunjungan).format('YYYY-MM-DD')}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Subjektif (Keluhan Utama)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="subjektif"
              placeholder="Keluhan utama pasien..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subjektif}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Keadaan Umum (KU)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="ku"
              placeholder="Keadaan umum pasien..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ku}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Kondisi Tambahan (KT)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="kt"
              placeholder="Kondisi tambahan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.kt}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Riwayat Penyakit Dahulu (RPD)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="rpd"
              placeholder="Riwayat penyakit dahulu..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rpd}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Riwayat Pengobatan Obat (RPO)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="rpo"
              placeholder="Riwayat pengobatan obat..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rpo}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Riwayat Penyakit Keluarga (RPK)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="rpk"
              placeholder="Riwayat penyakit keluarga..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rpk}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">Tanda Vital</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">Vital Sign Sensorium</h1>
              <input
                name="vitalSignSensorium"
                placeholder="Vital Sign Sensorium..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.vitalSignSensorium}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">TD (mmHg)</h1>
              <input
                name="td"
                placeholder="Tekanan Darah..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.td}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">
                HR (x/menit)
              </h1>
              <input
                name="hr"
                placeholder="Heart Rate..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.hr}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">
                RR (x/menit)
              </h1>
              <input
                name="rr"
                placeholder="Respiratory Rate..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rr}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">T (°C)</h1>
              <input
                name="t"
                placeholder="Suhu Tubuh..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.t}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">TB (cm)</h1>
              <input
                name="tb"
                placeholder="Tinggi Badan..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tb}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
            <div>
              <h1 className="font-medium text-[#B9B9B9] text-sm">BB (kg)</h1>
              <input
                name="bb"
                placeholder="Berat Badan..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bb}
                className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
              />
            </div>
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Pemeriksaan Fisik
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="pemeriksaanFisik"
              placeholder="Hasil pemeriksaan fisik..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pemeriksaanFisik}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Catatan Keperawatan
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="catatanKeperawatan"
              placeholder="Catatan keperawatan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.catatanKeperawatan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Diagnosa Penyakit
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="diagnosaPenyakit"
              placeholder="Diagnosa penyakit..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.diagnosaPenyakit}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Terapi (Therapy)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="therapy"
              placeholder="Terapi yang diberikan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.therapy}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Evaluasi Subjektif Objektif (ESO)
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="eso"
              placeholder="Evaluasi subjektif objektif..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.eso}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Rencana Pemeriksaan Penunjang
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="rencanaPemeriksaanPenunjang"
              placeholder="Rencana pemeriksaan penunjang..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rencanaPemeriksaanPenunjang}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">Rencana Edukasi</h1>
          <div className="w-full">
            <select
              name="Edukasi"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Edukasi}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            >
              <option value="POLAMAKAN">Pola Makan</option>
              <option value="POLAAKTIFITAS">Pola Aktifitas</option>
            </select>
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Rencana Rujukan
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="rencanaRujukan"
              placeholder="Rencana rujukan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rencanaRujukan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-[16px] py-[16px]">
          <button
            className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
            variant="secondary"
            onClick={() => router.push('/analisis-rekam-medis')}
          >
            Analisis Rekam Medis
          </button>
          <button
            className="rounded-[5px] border border-[#072B2E] py-[7px] px-[38px] text-black font-medium"
            variant="secondary"
            onClick={() => router.push('/pendaftaran')}
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
      </section>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ req, query }) => {
  const accessToken = req.session?.auth?.access_token;
  const user = req.session?.user || [];
  const { id } = query;

  const isLoggedIn = !!accessToken;
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  let dataPasien = [];
  let dataDokter = [];
  let dataRekamMedis = {};

  try {
    const res = await ClientRequest.GetRekamMedisById(accessToken, id);
    dataRekamMedis = res.data.results.data || {};
  } catch (error) {
    console.error('Error fetching RekamMedis data');
  }
  try {
    const res = await ClientRequest.GetPatient(accessToken, '', 10000, 1);
    dataPasien = res.data.results.data || [];
  } catch (error) {
    console.error('Error fetching pasien data');
  }

  try {
    const res = await ClientRequest.GetDokter(accessToken, '', 10000, 1);
    dataDokter = res.data.results.data || [];
  } catch (error) {
    console.error('Error fetching dokter data');
  }

  return {
    props: {
      user,
      listPasien: dataPasien || [],
      listDokter: dataDokter || [],
      listRekamMedis: dataRekamMedis || undefined,
    },
  };
});
