import axios from "axios";

const API_URL = "https://employee-task-tracker-ks1q.onrender.com/api/tasks";

export const addTask = async (task) => {
  const res = await axios.post(API_URL, task);
  return res.data;
};

export const getTasks = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
