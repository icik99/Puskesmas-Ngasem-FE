import ClientRequest from '@/utils/clientApiService';
import { withSession, withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const data = req.body;
  const id = req.query.id;

  let formData = new FormData();

  // Mengonversi Base64 ke File (Blob) dan menambahkannya ke FormData
  if (
    data.file &&
    typeof data.file === 'string' &&
    /^data:image\/[a-zA-Z]+;base64,/.test(data.file)
  ) {
    const base64String = data.file.split(',')[1];
    const mimeType = data.file.split(',')[0].split(':')[1].split(';')[0];
    const buffer = Buffer.from(base64String, 'base64');
    const blob = new Blob([buffer], { type: mimeType });

    formData.append('file', blob, 'file.jpg');
  } else {
    formData.append('file', data.file);
  }

  try {
    const response = await ClientRequest.UpdateFile(formData, id, token);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
