import React, { useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const icons = {
    success: <FaCheckCircle className="text-green-600" />,
    error: <FaExclamationCircle className="text-red-600" />,
    info: <FaInfoCircle className="text-blue-600" />,
    warning: <FaExclamationCircle className="text-yellow-600" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${styles[type]} shadow-md animate-slide-in`}
      role="alert"
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-current hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
