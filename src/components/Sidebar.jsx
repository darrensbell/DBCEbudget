import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FaTable, FaCog } from "react-icons/fa";

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
        <div>
          <span
            className={`connection-dot ${dbStatus.isConnected ? "bg-success" : "bg-danger"}`}
          ></span>
          <span>Database Connection</span>
        </div>
        {dbStatus.lastConnected && (
          <small className="text-muted">
            Last updated: {dbStatus.lastConnected.toLocaleString()}
          </small>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
