const SelectField = ({
  label,
  name,
  value,
  options,
  onChange
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-theme-secondary mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-dark-secondary text-theme-secondary border border-dark-primary rounded-lg p-2"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

export default SelectField;