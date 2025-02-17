import ClientRequest from '@/utils/clientApiService';
import { withSession, withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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

  const data = req.body;
  const id = req.query.id;

  let formData = new FormData();

  // Loop melalui data dan tambahkan ke FormData
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'eTTD' && data[key]) {
        // Validasi apakah nilai eTTD adalah base64
        const base64Data = data[key];
        const isBase64 = /^data:([A-Za-z-+\/]+);base64,/.test(base64Data);

        if (isBase64) {
          // Jika eTTD adalah base64, konversi ke file dan tambahkan ke FormData
          const file = base64ToFile(base64Data, 'signature.png'); // Konversi base64 ke file
          formData.append(key, file); // Tambahkan file ke FormData
        } else {
          console.warn(
            'Nilai eTTD bukan base64. Key eTTD tidak dimasukkan ke FormData.'
          );
        }
      } else {
        // Tambahkan key-value biasa ke FormData
        formData.append(key, data[key]);
      }
    }
  }
  try {
    const response = await ClientRequest.UpdateUser(formData, id, token);
    res.status(200).send('Success Update Profile');
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
