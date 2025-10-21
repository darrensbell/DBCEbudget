// Compliance: AI_LAW v1.1 - This file has been refactored to use the modular useVenues hook and its associated components.
import React, { useState } from "react";
import { useVenues } from "../hooks/useVenues";
import VenueList from "../components/Venues/VenueList";
import VenueForm from "../components/Venues/VenueForm";
import CategorySettings from "../components/CategorySettings";
import "../styles/Settings.css";

function Settings() {
  const {
    venues,
    error,
    addVenue,
    updateVenue,
    deleteVenue,
    setError,
  } = useVenues();

  const [newVenue, setNewVenue] = useState({
    venue_name: "",
    city: "",
    total_capacity: "",
    seat_kills: "0",
    comps: "0",
    producer_holds: "0",
    venue_rental: "0",
    extra_show_fee: "0",
    hourly_extra_rate: "0",
  });

  const [editingVenue, setEditingVenue] = useState(null);

  const handleAddVenue = async () => {
    const success = await addVenue(newVenue);
    if (success) {
      setNewVenue({
        venue_name: "",
        city: "",
        total_capacity: "",
        seat_kills: "0",
        comps: "0",
        producer_holds: "0",
        venue_rental: "0",
        extra_show_fee: "0",
        hourly_extra_rate: "0",
      });
    }
  };
  
  const handleUpdateVenue = async () => {
    const success = await updateVenue(editingVenue);
    if (success) {
        setEditingVenue(null);
    }
  }

  const startEditing = (venue) => {
    setEditingVenue({ ...venue });
    setError(null);
  };

  const renderInputField = (key, placeholder, isEditing) => (
    <input
      type={
        key.includes("capacity") ||
        key.includes("kills") ||
        key.includes("comps") ||
        key.includes("holds") ||
        key.includes("rate") ||
        key.includes("fee") ||
        key.includes("rental")
          ? "number"
          : "text"
      }
      className="form-control"
      placeholder={placeholder}
      value={isEditing ? editingVenue[key] : newVenue[key]}
      onChange={(e) => {
        const value = e.target.value;
        if (isEditing) {
          setEditingVenue({ ...editingVenue, [key]: value });
        } else {
          setNewVenue({ ...newVenue, [key]: value });
        }
      }}
    />
  );

  return (
    <div>
      <h2>Settings</h2>
      <div className="row">
        <div className="col-md-12">
            <VenueForm 
                newVenue={newVenue}
                setNewVenue={setNewVenue}
                handleAddVenue={handleAddVenue}
                renderInputField={renderInputField}
                error={error}
            />
            <VenueList 
                venues={venues}
                editingVenue={editingVenue}
                startEditing={startEditing}
                handleUpdateVenue={handleUpdateVenue}
                setEditingVenue={setEditingVenue}
                handleDeleteVenue={deleteVenue}
                renderInputField={renderInputField}
            />
        </div>
        <div className="col-md-12 mt-4">
          <CategorySettings />
        </div>
      </div>
    </div>
  );
}

export default Settings;
