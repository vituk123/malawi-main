import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  type?: string;
  hasError?: boolean;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', hasError = false, className, ...props }) => {
  const baseStyles = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-75';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const defaultStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const inputElement = type === 'textarea' ? (
    <textarea
      id={id}
      className={`${baseStyles} ${hasError ? errorStyles : defaultStyles} ${className || ''}`}
      {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  ) : (
    <input
      id={id}
      type={type}
      className={`${baseStyles} ${hasError ? errorStyles : defaultStyles} ${className || ''}`}
      {...props}
    />
  );

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {inputElement}
    </div>
  );
};

export default Input;
