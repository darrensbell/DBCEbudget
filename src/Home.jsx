import React from 'react';
import { FaSearch, FaBell, FaCog, FaGlobe, FaMoneyBill, FaExclamationTriangle, FaHeart } from 'react-icons/fa';

const StatCard = ({ icon, title, value, footerIcon, footerText }) => (
  <div className="stat-card">
    <div className="card-body">
      <div className="card-icon">{icon}</div>
      <div className="card-text">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
    </div>
    <div className="card-footer">
      {footerIcon && <span className="footer-icon">{footerIcon}</span>}
      {footerText}
    </div>
  </div>
);

function Home() {
  return (
    <>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-controls">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <FaSearch className="search-icon" />
          </div>
          <div className="control-icons">
            <FaBell className="icon" />
            <FaCog className="icon" />
          </div>
        </div>
      </div>

      <div className="card-deck">
        <StatCard icon={<FaGlobe />} title="Capacity" value="150GB" footerText="Update Now" />
        <StatCard icon={<FaMoneyBill />} title="Revenue" value="$1,345" footerText="Last day" />
        <StatCard icon={<FaExclamationTriangle />} title="Errors" value="23" footerText="In the last hour" />
        <StatCard icon={<FaHeart />} title="Followers" value="+45K" footerText="Update now" />
      </div>
    </>
  );
}

export default Home;
