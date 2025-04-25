import MetaHead from '@/components/MetaHead';
import Navbar from '@/components/Navbar';
import ClientRequest from '@/utils/clientApiService';
import { withSession } from '@/utils/sessionWrapper';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Create({
  listPasien,
  user,
  listDokter,
  listRekamMedis,
}) {
  const router = useRouter();
  const idRekamMedis = router.query.id;
  const formik = useFormik({
    initialValues: {
      Dokter:
        user.role === 'DOKTER' && !idRekamMedis
          ? user.id
          : listRekamMedis.Dokter,
      pasien: !idRekamMedis ? null : listRekamMedis.pasien,
      noRM: !idRekamMedis ? null : listRekamMedis.noRM,
      lamaPenyakit: !idRekamMedis ? null : listRekamMedis.lamaPenyakit,
      lain_lain: !idRekamMedis ? null : listRekamMedis.lain_lain,
      waktuPermeriksaan: !idRekamMedis
        ? null
        : listRekamMedis.waktuPermeriksaan,
      fisik: !idRekamMedis ? null : listRekamMedis.fisik,
      lain_lainHasilPemeriksaan: !idRekamMedis
        ? null
        : listRekamMedis.lain_lainHasilPemeriksaan,
      laboratorium: !idRekamMedis ? null : listRekamMedis.laboratorium,
      radiologi: !idRekamMedis ? null : listRekamMedis.radiologi,
      keadaanKeluarRS: !idRekamMedis ? null : listRekamMedis.keadaanKeluarRS,
      prognosa: !idRekamMedis ? null : listRekamMedis.prognosa,
      kapanPenyakitDahulu: !idRekamMedis
        ? null
        : listRekamMedis.kapanPenyakitDahulu,
      pengobatan: !idRekamMedis ? null : listRekamMedis.pengobatan,
      faktorEtimologi: !idRekamMedis ? null : listRekamMedis.faktorEtimologi,
      diagnosaAkhir: !idRekamMedis ? null : listRekamMedis.diagnosaAkhir,
      masalahDihadapi: !idRekamMedis ? null : listRekamMedis.masalahDihadapi,
      konsultasi: !idRekamMedis ? null : listRekamMedis.konsultasi,
      pengobatanTindakan: !idRekamMedis
        ? null
        : listRekamMedis.pengobatanTindakan,
      perjalananPeyakit: !idRekamMedis
        ? null
        : listRekamMedis.perjalananPeyakit,
      sebabMeninggal: !idRekamMedis ? null : listRekamMedis.sebabMeninggal,
      usulTidakLanjut: !idRekamMedis ? null : listRekamMedis.usulTidakLanjut,
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
              return err.response?.data?.error || 'Something went wrong';
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
        tidak ingin / tidak perlu diisi, silakan biarkan field tersebut kosong .
      </div>
      <section>
        <div className=" py-[20px] space-y-[20px]">
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
            Keluhan Utama
          </h1>
          <div className="w-full space-y-2">
            <h1 className="font-medium text-[#B9B9B9] text-sm">
              Lama Penyakit
            </h1>
            <input
              name="lamaPenyakit"
              placeholder="Lama Penyakit..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lamaPenyakit}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
            <h1 className="font-medium text-[#B9B9B9] text-sm">Lain-lain</h1>
            <textarea
              rows={3}
              name="lain_lain"
              placeholder="Lain-lain..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lain_lain}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Penyakit Dahulu
          </h1>
          <div className="w-full space-y-2">
            <h1 className="font-medium text-[#B9B9B9] text-sm">Kapan</h1>
            <input
              name="kapanPenyakitDahulu"
              type="text"
              placeholder="Kapan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.kapanPenyakitDahulu}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
            <h1 className="font-medium text-[#B9B9B9] text-sm">Pengobatan</h1>
            <textarea
              rows={3}
              name="pengobatan"
              placeholder="Pengobatan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pengobatan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />

            <h1 className="font-medium text-[#B9B9B9] text-sm">
              Faktor Etimologi
            </h1>
            <textarea
              rows={3}
              name="faktorEtimologi"
              placeholder="Faktor Etimologi..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.faktorEtimologi}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Hasil Pemeriksaan
          </h1>
          <div className="w-full space-y-2">
            <h1 className="font-medium text-[#B9B9B9] text-sm">
              Waktu Pemeriksaan
            </h1>
            <textarea
              rows={3}
              name="waktuPermeriksaan"
              placeholder="Waktu Pemeriksaan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.waktuPermeriksaan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
            <h1 className="font-medium text-[#B9B9B9] text-sm">Fisik</h1>
            <textarea
              rows={3}
              name="fisik"
              placeholder="Fisik..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fisik}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />

            <h1 className="font-medium text-[#B9B9B9] text-sm">Lain-lain</h1>
            <textarea
              rows={3}
              name="lain_lainHasilPemeriksaan"
              placeholder="Lain-lain..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lain_lainHasilPemeriksaan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
            <h1 className="font-medium text-[#B9B9B9] text-sm">Laboratorium</h1>
            <textarea
              rows={3}
              name="laboratorium"
              placeholder="Laboratorium..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.laboratorium}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
            <h1 className="font-medium text-[#B9B9B9] text-sm">Radiologi</h1>
            <textarea
              rows={3}
              name="radiologi"
              placeholder="Radiologi..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.radiologi}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            {' '}
            Diagnosa Akhir{' '}
          </h1>
          <div className="w-full">
            <input
              name="diagnosaAkhir"
              placeholder="Diagnosa Akhir..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.diagnosaAkhir}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            {' '}
            Masalah yang Dihadapi{' '}
          </h1>
          <div className="w-full">
            <input
              name="masalahDihadapi"
              placeholder="Masalah yang dihadapi..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.masalahDihadapi}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>
          <h1 className="mb-3 font-semibold text-lg border-b-2">Konsultasi</h1>
          <div className="w-full">
            <input
              name="konsultasi"
              placeholder="Konsultasi..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.konsultasi}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Pengobatan / Tindakan
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="pengobatanTindakan"
              placeholder="Pengobatan / Tindakan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pengobatanTindakan}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Perjalanan Penyakit Selama Pengobatan : Komplikasi
          </h1>
          <div className="w-full">
            <textarea
              rows={3}
              name="perjalananPeyakit"
              placeholder="Perjalanan Penyakit Selama Pengobatan : Komplikasi..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.perjalananPeyakit}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Keadaan Waktu Keluar Puskesmas
          </h1>
          <div className="w-full">
            <input
              name="keadaanKeluarRS"
              placeholder="Keadaan Waktu Keluar Puskesmas..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.keadaanKeluarRS}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">Prognosa</h1>
          <div className="w-full">
            <input
              name="prognosa"
              placeholder="Prognosa..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.prognosa}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Sebab Meninggal
          </h1>
          <div className="w-full">
            <input
              name="sebabMeninggal"
              placeholder="Sebab Meninggal..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sebabMeninggal}
              className="px-[13px] py-[8px] rounded-[5px] border-2 outline-none w-full text-sm"
            />
          </div>

          <h1 className="mb-3 font-semibold text-lg border-b-2">
            Usul Tindak Lanjut
          </h1>
          <div className="w-full">
            <input
              name="usulTidakLanjut"
              placeholder="Usul Tindak Lanjut..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.usulTidakLanjut}
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
