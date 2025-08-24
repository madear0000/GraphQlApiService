import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ label, error, helperText, id, className = '', ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;
  
  return (
    <div className="w-full space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border rounded-lg input-focus transition-all duration-200 ${
          hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        } ${className}`}
        {...props}
      />
      {hasError && (
        <p className="text-sm text-red-600 animate-slideIn">{error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;