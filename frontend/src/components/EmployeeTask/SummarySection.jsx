import React from "react";
import SummaryCard from "./SummaryCard";
function SummarySection({ totals }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard label="Total" value={totals.total} />
      <SummaryCard label="Completed" value={totals.completed} />
      <SummaryCard label="Pending" value={totals.pending} />
      <SummaryCard label="Count" value={totals.count} />
    </div>
  );
}

export default SummarySection