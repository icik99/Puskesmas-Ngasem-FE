import ClientRequest from '@/utils/clientApiService';
import { withSession, withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  // Fungsi untuk mengonversi base64 ke file
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(','); // Pisahkan base64 dari prefix (misal: "data:image/png;base64,...")
    const mime = arr[0].match(/:(.*?);/)[1]; // Ambil tipe MIME dari base64
    const bstr = atob(arr[1]); // Decode base64 ke binary string
    let n = bstr.length;
    const u8arr = new Uint8Array(n); // Buat Uint8Array dari binary string

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Buat file dari Uint8Array
    return new File([u8arr], filename, { type: mime });
  };

  const data = req?.body;

  try {
    let formData = new FormData();

    // Loop melalui data dan tambahkan ke FormData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'eTTD' && data[key]) {
          // Jika key adalah 'eTTD' dan memiliki nilai, konversi base64 ke file
          const base64Data = data[key];
          const file = base64ToFile(base64Data, 'signature.png'); // Konversi base64 ke file
          formData.append(key, file); // Tambahkan file ke FormData
        } else {
          // Tambahkan key-value biasa ke FormData
          formData.append(key, data[key]);
        }
      }
    }

    // Kirim FormData ke API
    const response = await ClientRequest.Register(formData);
    res.status(200).send(response.data.message);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export default withSessionRoute(api);
