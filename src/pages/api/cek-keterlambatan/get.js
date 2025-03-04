import ClientRequest from '@/utils/clientApiService';
import { withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await ClientRequest.CheckRekamMedisStatus(token);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
