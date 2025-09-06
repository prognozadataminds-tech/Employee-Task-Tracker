import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import SummarySection from "./SummarySection";
import TaskTable from "./TaskTable";

//LocalStorage Helpers
function loadRows() {
  try {
    const raw = localStorage.getItem("task_rows_v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveRows(next) {
  try {
    localStorage.setItem("task_rows_v1", JSON.stringify(next));
  } catch {}
}

export default function EmployeeTaskTracker() {
  const navigate = useNavigate();

  //State
  const [rows, setRows] = useState(() => loadRows());
  const [filterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search] = useState("");

  useEffect(() => {
    saveRows(rows);
  }, [rows]);

  //Derived Data
  const filtered = useMemo(() => {
    return rows
      .filter((r) => (filterDate ? r.date === filterDate : true))
      .filter((r) =>
        search.trim()
          ? r.employeeName.toLowerCase().includes(search.toLowerCase().trim())
          : true
      )
      .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
  }, [rows, filterDate, search]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.total += Number(r.total) || 0;
        acc.completed += Number(r.completed) || 0;
        acc.pending += Number(r.pending) || 0;
        acc.count += Number(r.count) || 0;
        return acc;
      },
      { total: 0, completed: 0, pending: 0, count: 0 }
    );
  }, [filtered]);

  function handleAdd(row) {
    setRows((prev) => [row, ...prev]);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this entry?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Employee Task Tracker
          </h1>
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            Login
          </button>
        </header>

        {/* Form */}
        <TaskForm onAdd={handleAdd} />

        {/* Summary */}
        <SummarySection totals={totals} />

        {/* Table */}
        <TaskTable rows={filtered} onDelete={handleDelete} />
      </div>
    </div>
  );
}
