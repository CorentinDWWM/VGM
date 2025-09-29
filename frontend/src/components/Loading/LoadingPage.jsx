export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-5">
      {/* Version 1: Loading simple avec spinner */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement en cours...
          </p>
        </div>
      </div>
    </div>
  );
}
