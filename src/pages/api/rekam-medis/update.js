import ClientRequest from '@/utils/clientApiService';
import { withSession, withSessionRoute } from '@/utils/sessionWrapper';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const data = req.body;
  const id = req.query.id;

  try {
    const response = await ClientRequest.UpdateRekamMedis(data, id, token);
    res.status(200).send('Success Update Rekam Medis');
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
