import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FaTable, FaCog, FaDatabase } from "react-icons/fa";

function Sidebar() {
  const [dbStatus, setDbStatus] = useState({
    isConnected: false,
    lastConnected: null,
  });

  useEffect(() => {
    const checkDbConnection = async () => {
      const { error } = await supabase
        .from("dbce_production")
        .select("id")
        .limit(1);
      setDbStatus({ isConnected: !error, lastConnected: new Date() });
    };

    checkDbConnection();
    const interval = setInterval(checkDbConnection, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      <h5>DBCE Budget Tool</h5>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/productions"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
            >
              <FaTable className="nav-icon" />
              <span>Productions</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCog className="nav-icon" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="db-status">
        <div className="db-status-header">
          <FaDatabase className={`db-icon ${dbStatus.isConnected ? "connected" : "disconnected"}`} />
          <span>Database</span>
        </div>
        {dbStatus.isConnected && dbStatus.lastConnected && (
          <div className="db-status-details">
            <span className="connection-dot bg-success"></span>
            <small className="text-muted">
              Updated: {dbStatus.lastConnected.toLocaleTimeString()}
            </small>
          </div>
        )}
        {!dbStatus.isConnected && (
            <div className="db-status-details">
                <span className="connection-dot bg-danger"></span>
                <small className="text-muted">Connection failed</small>
            </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
