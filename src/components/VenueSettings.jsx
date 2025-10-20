import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import "../styles/Settings.css";

function VenueSettings() {
  const [venues, setVenues] = useState([]);
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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const calculateSellable = (venue) => {
    const capacity = parseInt(venue.total_capacity) || 0;
    const kills = parseInt(venue.seat_kills) || 0;
    const num_comps = parseInt(venue.comps) || 0;
    const holds = parseInt(venue.producer_holds) || 0;
    return capacity - kills - num_comps - holds;
  };

  const fetchVenues = async () => {
    const { data, error } = await supabase
      .from("dbce_venue")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching venues:", error);
      setError("Could not fetch venues.");
    } else {
      setVenues(data);
    }
  };

  const validateVenue = (venue) => {
    if (!venue.venue_name.trim() || !venue.city.trim()) {
      return "Venue Name and City cannot be empty.";
    }
    const numericFields = [
      "total_capacity",
      "seat_kills",
      "comps",
      "producer_holds",
      "venue_rental",
      "extra_show_fee",
      "hourly_extra_rate",
    ];
    for (const field of numericFields) {
      if (isNaN(venue[field]) || venue[field] === "") {
        return `Please enter a valid number for ${field.replace("_", " ")}.`;
      }
    }
    if (Number(venue.total_capacity) <= 0) {
      return "Total Capacity must be a positive number.";
    }
    return null;
  };

  const handleAddVenue = async () => {
    setError(null);
    const total_sellable = calculateSellable(newVenue);
    const venueData = { ...newVenue, total_sellable };

    const validationError = validateVenue(venueData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { data, error } = await supabase
      .from("dbce_venue")
      .insert([venueData])
      .select();
    if (error) {
      console.error("Error adding venue:", error);
      setError("Failed to add venue.");
    } else {
      setVenues([data[0], ...venues]);
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

  const handleUpdateVenue = async (id) => {
    setError(null);
    const total_sellable = calculateSellable(editingVenue);
    const venueData = { ...editingVenue, total_sellable };

    const validationError = validateVenue(venueData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { data, error } = await supabase
      .from("dbce_venue")
      .update(venueData)
      .match({ id })
      .select();
    if (error) {
      console.error("Error updating venue:", error);
      setError("Failed to update venue.");
    } else {
      setVenues(venues.map((v) => (v.id === id ? data[0] : v)));
      setEditingVenue(null);
    }
  };

  const handleDeleteVenue = async (id) => {
    const { error } = await supabase.from("dbce_venue").delete().match({ id });
    if (error) {
      console.error("Error deleting venue:", error);
      setError("Failed to delete venue.");
    } else {
      setVenues(venues.filter((v) => v.id !== id));
    }
  };

  const startEditing = (venue) => {
    setEditingVenue({ ...venue });
    setError(null);
  };

  const renderInputField = (key, placeholder) => (
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
      value={editingVenue ? editingVenue[key] : newVenue[key]}
      onChange={(e) => {
        const value = e.target.value;
        if (editingVenue) {
          setEditingVenue({ ...editingVenue, [key]: value });
        } else {
          setNewVenue({ ...newVenue, [key]: value });
        }
      }}
    />
  );

  const renderRow = (venue) => {
    const isEditing = editingVenue?.id === venue.id;
    const currentData = isEditing ? editingVenue : venue;
    const totalSellable = calculateSellable(currentData);

    return (
      <tr key={venue.id}>
        <td>
          {isEditing
            ? renderInputField("venue_name", "Venue Name")
            : venue.venue_name}
        </td>
        <td>{isEditing ? renderInputField("city", "City") : venue.city}</td>
        <td>
          {isEditing
            ? renderInputField("total_capacity", "Total Capacity")
            : venue.total_capacity}
        </td>
        <td>
          {isEditing
            ? renderInputField("seat_kills", "Seat Kills")
            : venue.seat_kills}
        </td>
        <td>{isEditing ? renderInputField("comps", "Comps") : venue.comps}</td>
        <td>
          {isEditing
            ? renderInputField("producer_holds", "Producer Holds")
            : venue.producer_holds}
        </td>
        <td>{totalSellable}</td>
        <td>
          {isEditing
            ? renderInputField("venue_rental", "Venue Rental")
            : venue.venue_rental}
        </td>
        <td>
          {isEditing
            ? renderInputField("extra_show_fee", "Extra Show Fee")
            : venue.extra_show_fee}
        </td>
        <td>
          {isEditing
            ? renderInputField("hourly_extra_rate", "Hourly Extra Rate")
            : venue.hourly_extra_rate}
        </td>
        <td className="text-right">
          {isEditing ? (
            <>
              <button
                className="btn btn-success btn-round btn-icon"
                onClick={() => handleUpdateVenue(venue.id)}
              >
                <FaSave />
              </button>
              <button
                className="btn btn-secondary btn-round btn-icon"
                onClick={() => setEditingVenue(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-warning btn-round btn-icon"
                onClick={() => startEditing(venue)}
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-danger btn-round btn-icon"
                onClick={() => handleDeleteVenue(venue.id)}
              >
                <FaTrash />
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Manage Venues</h4>
      </div>
      <div className="card-body">
        <h5>Add New Venue</h5>
        <div className="add-item-form-grid">
          {renderInputField("venue_name", "Venue Name")}
          {renderInputField("city", "City")}
          {renderInputField("total_capacity", "Total Capacity")}
          {renderInputField("seat_kills", "Seat Kills")}
          {renderInputField("comps", "Comps")}
          {renderInputField("producer_holds", "Producer Holds")}
          {renderInputField("venue_rental", "Venue Rental ($)")}
          {renderInputField("extra_show_fee", "Extra Show Fee ($)")}
          {renderInputField("hourly_extra_rate", "Hourly Extra Rate ($)")}
        </div>
        <button
          className="btn btn-primary btn-round mt-3"
          onClick={handleAddVenue}
        >
          <FaPlus /> Add Venue
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="table-responsive mt-4">
          <table className="table">
            <thead className="text-primary">
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Kills</th>
                <th>Comps</th>
                <th>Holds</th>
                <th>Sellable</th>
                <th>Rental</th>
                <th>Extra Fee</th>
                <th>Hourly Rate</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{venues.map(renderRow)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VenueSettings;
