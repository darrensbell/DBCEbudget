import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Productions from './Productions';
import Settings from './Settings';
import Budget from './pages/Budget';
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/productions" />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget/:showId" element={<Budget />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
