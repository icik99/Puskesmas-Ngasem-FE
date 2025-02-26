import Api from '@/utils/apiService';
import { withSessionRoute } from '@/utils/sessionWrapper';

const api = withSessionRoute(async (req, res) => {
  const { userName, password } = req.body;
  switch (req.method) {
    case 'POST': {
      try {
        const result = await Api.request({
          method: 'POST',
          url: 'auth/login',
          data: { userName, password },
        });
        const { data: _data } = result;
        req.session.auth = {
          access_token: _data?.results?.data?.token,
        };
        req.session.user = {
          role: _data?.results?.data?.user?.role,
          namaLengkap: _data?.results?.data?.user?.namaLengkap,
          id: _data?.results?.data?.user?.id,
          userName: _data?.results?.data?.user?.userName,
        };
        await req.session.save();
        return res.status(200).json(_data?.results?.data?.user);
      } catch (error) {
        return res.status(500).send({ message: 'Something went wrong' });
      }
    }
    default: {
      return res.status(405).send({ message: 'Method not allowed' });
    }
  }
});
export default api;
