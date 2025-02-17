import ClientRequest from '@/utils/clientApiService';
import { withSessionRoute } from '@/utils/sessionWrapper';
import { useState } from 'react';

const api = async (req, res) => {
  const token = req.session?.auth?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const keyword = req.query.search === '' ? '' : req.query.search;
  const limit = req.query?.limit || '';
  const page = req.query?.page || '';

  try {
    const response = await ClientRequest.GetRekamMedis(
      token,
      keyword,
      limit,
      page
    );
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default withSessionRoute(api);
