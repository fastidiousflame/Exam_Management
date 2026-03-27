import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EnrollStudent from "./pages/EnrollStudent";
import Teacher from "./pages/Teacher";
import Register from "./pages/Register";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enroll" element={<EnrollStudent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;