import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          500
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Internal server error
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
