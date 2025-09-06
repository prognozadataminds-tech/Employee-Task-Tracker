import React from "react";
import Th from "./Th";
import Td from "./Td";

// Converts "HH:MM" 24-hour to 12-hour format with AM/PM
function to12Hour(hhmm) {
  if (!hhmm) return "";

  // Already in 12-hour format (contains AM/PM)
  if (/AM|PM/i.test(hhmm)) return hhmm;

  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;

  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function TaskTable({ rows, onDelete }) {
  // Sort by createdAt descending and take only 10 most recent
  const recentRows = [...rows]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <Th>Employee</Th>
            <Th>Task</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th className="text-right">Total</Th>
            <Th className="text-right">Completed</Th>
            <Th className="text-right">Pending</Th>
            <Th className="text-right">Count</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {recentRows.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-6 text-center text-gray-500">
                No entries yet.
              </td>
            </tr>
          ) : (
            recentRows.map((r) => (
              <tr key={r._id || r.id} className="border-t">
                <Td>{r.employeeName}</Td>
                <Td>{r.task}</Td>
                <Td>{r.date}</Td>
                <Td>{to12Hour(r.time)}</Td>
                <Td align="right">{r.total}</Td>
                <Td align="right">{r.completed}</Td>
                <Td align="right">{r.pending}</Td>
                <Td align="right">{r.count}</Td>
                <Td>
                  <button
                    onClick={() => onDelete(r._id || r.id)}
                    className="rounded-xl border px-3 py-1 text-xs hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
