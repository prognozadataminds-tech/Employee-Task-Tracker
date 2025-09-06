import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    task: { type: String, required: true },
    domain: { type: String },
    time: { type: String, required: true },
    total: { type: Number, required: true },
    completed: { type: Number, required: true },
    pending: { type: Number, required: true },
    count: { type: Number, default: 0 },
    date: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
