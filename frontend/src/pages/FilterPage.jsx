import React, { useState, useEffect, useMemo } from "react";
import { getTasks } from "../api/taskApi";

export default function FilterPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");

  // Fetch tasks
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

  // Filter + sort
  const filtered = useMemo(() => {
    return rows
      .filter((r) =>
        fromDate ? new Date(r.date) >= new Date(fromDate) : true
      )
      .filter((r) => (toDate ? new Date(r.date) <= new Date(toDate) : true))
      .filter((r) =>
        employeeFilter ? r.employeeName === employeeFilter : true
      )
      .filter((r) => (taskFilter ? r.task === taskFilter : true))
      .filter((r) =>
        search.trim()
          ? r.employeeName.toLowerCase().includes(search.toLowerCase().trim()) ||
            r.task.toLowerCase().includes(search.toLowerCase().trim())
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rows, fromDate, toDate, employeeFilter, taskFilter, search]);

  // 🔹 Unique employees & tasks from FILTERED rows (not all rows)
  const employees = [...new Set(filtered.map((r) => r.employeeName))];
  const tasks = [...new Set(filtered.map((r) => r.task))];

  // Reset filters
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setEmployeeFilter("");
    setTaskFilter("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Advanced Filter</h1>
          <button
            onClick={resetFilters}
            className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            Reset Filters
          </button>
        </header>

        {/* Advanced Filters */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <FilterBox label="From Date">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>

          <FilterBox label="To Date">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>

          <FilterBox label="Employee">
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            >
              <option value="">All</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </FilterBox>

          <FilterBox label="Task">
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            >
              <option value="">All</option>
              {tasks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FilterBox>

          <FilterBox label="Search">
            <input
              type="text"
              placeholder="Search employee or task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>
        </div>

        {/* Table */}
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
                <Th className="text-right">Allotment ID</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
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
                    <Td align="right">{r.pending}</Td>
                    <Td align="right">{r.count}</Td>
                    <Td align="right">{r.allotmentID}</Td>
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
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
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
