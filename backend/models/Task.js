import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    task: { type: String, required: true },
    total: { type: Number, required: true },
    allotmentID: { type: String },
    completed: { type: Number, required: true },
     count: { type: Number, default: 0 },
    pending: { type: Number, required: true },
     time: { type: String, required: true },
    date: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
