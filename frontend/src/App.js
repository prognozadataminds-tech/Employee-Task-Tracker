import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeTaskTracker from "./components/EmployeeTask/EmployeeTask";
import FilterPage from "./pages/FilterPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeTaskTracker />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/filter" element={<FilterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
