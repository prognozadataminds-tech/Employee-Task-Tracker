import React, { useState, useEffect, useMemo } from "react";
import { getTasks } from "../api/taskApi";

function toMinutes(timeStr) {
  if (!timeStr) return null;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

 
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}


export default function FilterPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
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


      .filter((r) => {
        if (!fromTime && !toTime) return true;
        if (!r.time) return false;

        const taskMinutes = toMinutes(r.time);       // DB time
        const fromMinutes = fromTime ? toMinutes(fromTime) : null;
        const toMinutesVal = toTime ? toMinutes(toTime) : null;

        return (!fromMinutes || taskMinutes >= fromMinutes) &&
          (!toMinutesVal || taskMinutes <= toMinutesVal);
      })



      .filter((r) => (taskFilter ? r.task === taskFilter : true))
      .filter((r) =>
        search.trim()
          ? r.employeeName.toLowerCase().includes(search.toLowerCase().trim()) ||
          r.task.toLowerCase().includes(search.toLowerCase().trim())
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rows, fromDate, toDate, fromTime, toTime, employeeFilter, taskFilter, search]);


  // Unique employees & tasks from FILTERED rows (not all rows)
  const employees = [...new Set(filtered.map((r) => r.employeeName))];
  const tasks = [...new Set(filtered.map((r) => r.task))];
  // Task summaries per task
  const taskSummaries = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      const t = r.task || "Unknown";
      if (!map[t]) {
        map[t] = { task: t, total: 0, completed: 0, count: 0 };
      }
      map[t].total = Number(r.total) || 0;
      map[t].completed += Number(r.completed) || 0;
      map[t].count += Number(r.count) || 0;
    });
    return Object.values(map).map((t) => ({
      ...t,
      pending: t.total - t.completed,
    }));
  }, [filtered]);

  // Reset filters
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setFromTime("");
    setToTime("");
    setEmployeeFilter("");
    setTaskFilter("");
    setSearch("");
  };

 
  function formatToAmPm(time24) {
    if (!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  }

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
          <FilterBox label="From Time">
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </FilterBox>
          <FilterBox label="To Time">
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
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

        <div className="mb-6 grid grid-cols-1 gap-6">
          {taskSummaries.map((t, idx) => (
            <div
              key={idx}
              className="w-full rounded-2xl border bg-white shadow-lg overflow-x-auto"
            >
              <table className="min-w-full text-base">
                <thead>
                  <tr className="bg-gray-100 text-sm uppercase text-gray-600">
                    <th className="w-1/3 px-6 py-3 text-left">Task</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-6 py-3 text-right">Completed</th>
                    <th className="px-6 py-3 text-right">Pending</th>
                    <th className="px-6 py-3 text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="px-6 py-4 font-medium">{t.task}</td>
                    <td className="px-6 py-4 text-right">{t.total}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold">
                      {t.completed}
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-semibold">
                      {t.pending}
                    </td>
                    <td className="px-6 py-4 text-right text-blue-600 font-semibold">
                      {t.count}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
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
