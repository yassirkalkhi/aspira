import ErrorMessage from "./ErrorMessage";

const InputField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    type = "text", 
    required, 
    placeholder 
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-theme-secondary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-dark-secondary text-theme-secondary border ${
          error ? "border-red-500" : "border-dark-primary"
        } rounded-lg p-2`}
      />
      <ErrorMessage error={error} />
    </div>
  );
  export default InputField;
  