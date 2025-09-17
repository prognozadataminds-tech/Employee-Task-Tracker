import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeTaskTracker from "./components/EmployeeTask/EmployeeTask";
import FilterPage from "./pages/FilterPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeTaskTracker />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/filter" element={<FilterPage />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
