const Checkbox = ({
    label,
    checked,
    onChange
  }: {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-dark-primary text-theme-primary focus:ring-theme-primary"
      />
      <label className="text-sm text-theme-secondary">{label}</label>
    </div>
  );
  

  export default Checkbox;