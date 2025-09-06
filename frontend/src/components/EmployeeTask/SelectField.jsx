
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="sm:col-span-2 flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-black focus:ring-black"
      >
        <option value="">-- Select {label} --</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
export default SelectField