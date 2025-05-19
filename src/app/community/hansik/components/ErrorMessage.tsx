'use client';

interface ErrorMessageProps {
  message: string;
  description?: string;
}

const ErrorMessage = ({ message, description }: ErrorMessageProps) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 text-sm font-medium">
        <span className="mr-2">⚠️</span>
        {message}
      </p>
      {description && (
        <p className="text-red-500 text-xs mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default ErrorMessage;
