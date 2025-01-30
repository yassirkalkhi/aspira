import ErrorMessage from "./ErrorMessage";

const TextArea = ({
    label,
    name,
    value,
    onChange,
    error,
    rows,
    required
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    rows: number;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-theme-secondary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full bg-dark-secondary text-theme-secondary border ${
          error ? "border-red-500" : "border-dark-primary"
        } rounded-lg p-2`}
      />
      <ErrorMessage error={error} />
    </div>
  );

  export default TextArea;