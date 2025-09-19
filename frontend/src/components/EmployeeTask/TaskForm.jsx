import React, { useState, useMemo, useEffect } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { addTask } from "../../api/taskApi";
import Papa from "papaparse"; // npm install papaparse
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

// Helper: Convert system time to "HH:MM AM/PM"
function getCurrentTime12Hour() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${ampm}`;
}

export default function TaskForm({ onAdd }) {
  const [employeeName, setEmployeeName] = useState("");
  const [task, setTask] = useState("");
  const [allotmentID, setAllotmentID] = useState(0); // auto-fill from Sheet2
  const [time, setTime] = useState(() => getCurrentTime12Hour());
  const [total, setTotal] = useState(10); // auto-fill from Sheet2 total rows
  const [completed, setCompleted] = useState("");
  const [count, setCount] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  // CSV to Employee → Tasks mapping (Sheet1)
  const [empTaskMap, setEmpTaskMap] = useState({});
  const [taskOptions, setTaskOptions] = useState([]);

  // Domain count mapping from Sheet2 (Allotment G column)
  const [empDomainCount, setEmpDomainCount] = useState({});

  // Fetch Sheet1 → Employee → Task mapping
  useEffect(() => {
    const url1 =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJvoOU2HdiAh1-AEwKlLpcSjCLXM_KXUadYytvSmrnjAASSJX-sv0hLVyvPEAI4Q/pub?output=csv";

    fetch(url1)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          complete: (results) => {
            const rows = results.data;
            const map = {};

            rows.forEach((row, index) => {
              if (index === 0) return; // header skip
              const emp = row[0]?.trim();
              const task = row[1]?.trim();
              if (!emp || !task) return;

              // Normalize Employee → UPPERCASE
              const normalizedEmp = emp.trim().toUpperCase();

              if (!map[normalizedEmp]) map[normalizedEmp] = [];
              map[normalizedEmp].push(task);
            });

            console.log("Parsed Task Map:", map);
            setEmpTaskMap(map);
          },
        });
      })
      .catch((err) => console.error("Error fetching Sheet1:", err));
  }, []);

  // Fetch Sheet2 → Allotment counts (Column G) + total rows
  useEffect(() => {
    const url2 =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJvoOU2HdiAh1-AEwKlLpcSjCLXM_KXUadYytvSmrnjAASSJX-sv0hLVyvPEAI4Q/pub?output=csv&gid=1040863835";

    fetch(url2)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          complete: (results) => {
            const rows = results.data;
            const countMap = {};

            // total rows (minus header row)
            const totalRows = rows.length - 1;
            setTotal(totalRows);

            rows.forEach((row, index) => {
              if (index === 0) return; // skip header
              let emp = row[0]?.trim();
              if (!emp) return;

              // Normalize Employee → UPPERCASE
              const normalizedEmp = emp.trim().toUpperCase();

              if (!countMap[normalizedEmp]) countMap[normalizedEmp] = 0;
              countMap[normalizedEmp]++;
            });

            console.log("Allotment Count Map:", countMap);
            console.log("Sheet2 Total Rows:", totalRows);
            setEmpDomainCount(countMap);
          },
        });
      })
      .catch((err) => console.error("Error fetching Sheet2:", err));
  }, []);

  // Employee select → Task options + AllotmentID count
  useEffect(() => {
    if (employeeName) {
      // Tasks from Sheet1
      if (empTaskMap[employeeName]) {
        setTaskOptions(empTaskMap[employeeName]);
        setTask(empTaskMap[employeeName][0]); // auto select 1st task
      } else {
        setTaskOptions([]);
        setTask("");
      }

      // AllotmentID from Sheet2
      if (empDomainCount[employeeName]) {
        setAllotmentID(empDomainCount[employeeName]);
      } else {
        setAllotmentID(0);
      }
    } else {
      setTaskOptions([]);
      setTask("");
      setAllotmentID(0);
    }
  }, [employeeName, empTaskMap, empDomainCount]);

  const pending = useMemo(
    () => Math.max(0, Number(allotmentID) - Number(completed)),
    [total, completed]
  );

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeName.trim() || !task || !time.trim()) {
      toast.error("Employee ,Task, and Time are required!");
      return;
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timeRegex.test(time.trim())) {
      toast.error("Invalid time format. Use HH:MM AM/PM.");
      return;
    }

    if (completed === "" || Number(completed) <= 0) {
      toast.error("Completed must be greater than 0.");
      return;
    }

    if (Number(completed) > Number(total)) {
      toast.error("Completed cannot exceed Total.");
      return;
    }

    if (count === "" || Number(count) < 0) {
      toast.error("Count must be ≥ 0.");
      return;
    }

    const newTask = {
      employeeName: employeeName.trim(),
      task,
      allotmentID: Number(allotmentID),
      time: time.trim(),
      total,
      completed: Number(completed),
      pending,
      count: Number(count),
      date,
    };

    try {
      const savedTask = await addTask(newTask);
      onAdd(savedTask);

      toast.success("✅ Task added successfully!");

      // Reset form (keep employee+task for quick entries)
      setTime(getCurrentTime12Hour());
      setCompleted("");
      setCount("");
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add task. Please try again.");
    }
  };

  const employeeOptions = [
    "VSN", "SRJ", "PYD", "SMP", "BDR",
    "NVJ", "SGT", "SLI", "SHA", "PDS",
    "NVG","NEW1","NEW2","NEW3"
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-3xl border bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SelectField
          label="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          options={employeeOptions}
        />

        <SelectField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          options={taskOptions}
        />

        <InputField
          label="Total"
          type="number"
          value={total}
          readOnly
          tabIndex={-1}
          className="bg-gray-50 text-gray-700"
        />

        <InputField
          label="Allotment ID"
          type="number"
          value={allotmentID}
          readOnly
          tabIndex={-1}
          className="bg-gray-50 text-gray-700"
        />

        <InputField
          label="Completed"
          type="number"
          min={1}
          value={completed}
          onChange={(e) => setCompleted(Number(e.target.value))}
        />

        <InputField
          label="Count"
          type="number"
          min={0}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />

        <InputField
          label="Allotment ID Pending"
          type="number"
          value={pending}
          readOnly
          tabIndex={-1}
          className="bg-gray-50 text-gray-700"
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
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500"></p>
        <button className="rounded-2xl bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
          Add Entry
        </button>
      </div>
    </form>
  );
}
