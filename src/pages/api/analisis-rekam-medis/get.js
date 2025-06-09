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
  const start_date = req.query?.start_date || '';
  const end_date = req.query?.end_date || '';

  try {
    const response = await ClientRequest.GetAnalisisRekamMedis(token, keyword, limit, page, start_date, end_date);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.response.data.message });
  }
};

export default withSessionRoute(api);
