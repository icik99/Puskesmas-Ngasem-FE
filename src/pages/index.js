import { withSession } from '@/utils/sessionWrapper';

const RedirectEmpty = () => {
  return <></>;
};
export default RedirectEmpty;
export const getServerSideProps = withSession(async ({ req }) => {
  const accessToken = req.session?.auth?.access_token;
  const isLoggedIn = !!accessToken;
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
});
