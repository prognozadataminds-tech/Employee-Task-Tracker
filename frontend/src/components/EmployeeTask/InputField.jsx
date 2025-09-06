function InputField({ label, className = "", ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring ${className}`}
      />
    </div>
  );
}
export default  InputField