'use client';

const LoadingSpinner = () => {
  return (
    <div className="flex-1 flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
