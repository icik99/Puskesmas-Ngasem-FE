import Layout from '@/components/Layout';
import '@/styles/globals.css';
import moment from 'moment';
import { Toaster } from 'react-hot-toast';
import 'moment/locale/id'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
