import React, { useState, useEffect, useMemo } from "react";
import { getTasks } from "../api/taskApi"; // adjust path if needed

export default function FilterPage() {
  const [rows, setRows] = useState([]);
  const [filterDate, setFilterDate] = useState(""); // empty = no filter
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setRows(data);
      } catch (error) {
        console.error("❌ Failed to fetch tasks:", error);
      }
    })();
  }, []);

  // Filter +sort rows
  const filtered = useMemo(() => {
    return rows
      .filter((r) => (filterDate ? r.date === filterDate : true))
      .filter((r) =>
        search.trim()
          ? r.employeeName.toLowerCase().includes(search.toLowerCase().trim())
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // recent first
  }, [rows, filterDate, search]);

  // Calculate totals
  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        const total = Number(r.total) || 0;
        const completed = Number(r.completed) || 0;
        const pending = total - completed;
        const count = Number(r.count) || 0;

        acc.total += total;
        acc.completed += completed;
        acc.pending += pending;
        acc.count += count;

        return acc;
      },
      { total: 0, completed: 0, pending: 0, count: 0 }
    );
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
      
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Filter Data</h1>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterBox label="Filter by Date">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>

          <FilterBox label="Search Employee">
            <input
              type="text"
              placeholder="e.g., e1, e2, John"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Total" value={totals.total} />
          <SummaryCard label="Completed" value={totals.completed} />
          <SummaryCard label="Pending" value={totals.pending} />
          <SummaryCard label="Count" value={totals.count} />
        </div>

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
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id || r.id} className="border-t">
                    <Td>{r.employeeName}</Td>
                    <Td>{r.task}</Td>
                    <Td>{r.date}</Td>
                    <Td>{r.time}</Td>
                    <Td align="right">{r.total}</Td>
                    <Td align="right">{r.completed}</Td>
                    <Td align="right">{r.total - r.completed}</Td>
                    <Td align="right">{r.count}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterBox({ label, children }) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

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

function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

function Td({ children, align = "left" }) {
  return (
    <td className={`px-4 py-3 ${align === "right" ? "text-right" : ""}`}>
      {children}
    </td>
  );
}
