export default function SettingsInput({
  label,
  id,
  type = "text",
  defaultValue,
  onChange,
  step = 1,
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        step={step}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}
