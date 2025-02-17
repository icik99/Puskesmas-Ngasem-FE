import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const useFetchData = (url, initialPageSize = 10) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    dataPerpages: initialPageSize,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(
    async (page = 1, limit = initialPageSize, searchQuery = '') => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: { page, limit, search: searchQuery },
        });
        setData(response.data.data.results.data);
        setPagination({
          currentPage: page,
          totalPage: response.data.data.results.totalPages,
          dataPerpages: limit,
        });
      } catch (error) {
        if (error?.response?.data?.error === 'Invalid token') {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  const debouncedFetchData = useCallback(
    debounce((page, pageSize, searchQuery) => {
      fetchData(page, pageSize, searchQuery);
    }, 300),
    [fetchData]
  );

  return {
    data,
    pagination,
    loading,
    fetchData,
    setSearch,
    debouncedFetchData,
  };
};

export default useFetchData;
