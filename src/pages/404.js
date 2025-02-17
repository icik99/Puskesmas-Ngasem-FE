import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 w-full">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/dashboard" className="text-blue-500 underline">
        Back to dashboard
      </Link>
    </div>
  );
};

export default Custom404;
