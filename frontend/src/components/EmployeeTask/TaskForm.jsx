import React, { useState, useMemo } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { addTask } from "../../api/taskApi";

export default function TaskForm({ onAdd }) {
  const [employeeName, setEmployeeName] = useState("");
  const [task, setTask] = useState("");
  const [domain, setDomain] = useState("");
  const [time, setTime] = useState("");
  const [total, setTotal] = useState(10);
  const [completed, setCompleted] = useState("");
  const [count, setCount] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const taskOptions = [
    "Association Data Collection",
    "Bio Profiling",
    "Clinical Trials",
    "Conference Data Collection",
    "Contact Details (Minicrawls)",
    "Descriptors",
    "Disclosure Research",
    "Editorial Board Data Collection",
    "Guidelines",
    "Industry Research",
    "KOL Connect (Tool)",
    "Person Standardization",
    "Validation (Country, Degree, Speciality)",
    "Others",
  ];

  const pending = useMemo(
    () => Math.max(0, Number(total) - Number(completed)),
    [total, completed]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeName.trim() || !task || !time.trim())
      return alert("Employee, Task, Time required");

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timeRegex.test(time.trim())) return alert("Invalid time format");

    if (completed === "" || Number(completed) <= 0)
      return alert("Completed > 0 required");
    if (Number(completed) > Number(total))
      return alert("Completed cannot exceed Total");
    if (count === "" || Number(count) < 0) return alert("Count ≥ 0 required");

    const newTask = {
      employeeName: employeeName.trim(),
      task,
      domain,
      time: time.trim(),
      total,
      completed,
      pending,
      count,
      date,
    };

    try {
      const savedTask = await addTask(newTask);
      onAdd(savedTask);

      // Reset form
      setTask("");
      setDomain("");
      setTime("");
      setCompleted("");
      setCount("");
      setDate(new Date().toISOString().slice(0, 10)); // Reset date to today
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-3xl border bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <InputField
          label="Employee Name"
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="e.g., e1"
          required
        />
        <SelectField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          options={taskOptions}
        />
        <InputField
          label="Domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain"
        />
        <InputField
          label="Time (HH:MM AM/PM)"
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="12:08 AM"
          required
        />
        <InputField
          label="Total"
          type="number"
          min={0}
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
        />
        <InputField
          label="Completed"
          type="number"
          min={1}
          value={completed}
          onChange={(e) => setCompleted(Number(e.target.value))}
        />
        <InputField
          label="Pending (auto)"
          type="number"
          value={pending}
          readOnly
          tabIndex={-1}
          className="bg-gray-50 text-gray-700"
        />
        <InputField
          label="Count"
          type="number"
          min={0}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <InputField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Pending = Total − Completed (auto-calculated)
        </p>
        <button className="rounded-2xl bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
          Add Entry
        </button>
      </div>
    </form>
  );
}
