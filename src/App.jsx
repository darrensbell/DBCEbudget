import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Productions from "./pages/Productions";
import Settings from "./pages/Settings";
import Budget from "./pages/Budget";
import RecoupmentPage from "./pages/RecoupmentPage";
import "./styles/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/productions" />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/productions/:productionId/recoupment" element={<RecoupmentPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget/:showId" element={<Budget />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
