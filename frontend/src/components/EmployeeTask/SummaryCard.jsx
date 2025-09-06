function SummaryCard({ label, value }) {
  return (
    <div className="rounded-3xl border bg-white p-4 text-center shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
export default SummaryCard