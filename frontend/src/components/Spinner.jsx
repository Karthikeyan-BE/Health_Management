import { Loader2 } from 'lucide-react';

/**
 * A simple, reusable loading spinner.
 */
const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
  );
};

export default Spinner;