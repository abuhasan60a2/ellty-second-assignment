import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start gap-3">
      <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
      <p className="text-red-800 text-sm flex-grow">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
          aria-label="Dismiss error"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

