import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ error }: { error?: string }) => 
    error ? (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" /> {error}
      </p>
    ) : null;

export default ErrorMessage;