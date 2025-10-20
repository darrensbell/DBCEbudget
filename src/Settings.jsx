import React from "react";
import VenueSettings from "./components/VenueSettings";
import CategorySettings from "./components/CategorySettings";

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <div className="row">
        <div className="col-md-12">
          <VenueSettings />
        </div>
        <div className="col-md-12 mt-4">
          <CategorySettings />
        </div>
      </div>
    </div>
  );
}

export default Settings;
