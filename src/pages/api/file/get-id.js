import ClientRequest from '@/utils/clientApiService';
import { withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = req.query.id;

  try {
    const response = await ClientRequest.GetFileById(token, id);
    res.json({ data: response.data.data });
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
