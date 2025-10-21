import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import "../styles/Settings.css";
import { formatCurrency } from "../lib/currency";

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
    const validationError = validateVenue(newVenue);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { total_sellable, ...venueData } = newVenue;

    const { data, error } = await supabase
      .from("dbce_venue")
      .insert([venueData])
      .select();
    if (error) {
      console.error("Error adding venue:", error);
      setError("Failed to add venue.");
    } else {
      fetchVenues(); // Refetch to get the generated value
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
    const validationError = validateVenue(editingVenue);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { total_sellable, created_at, ...venueData } = editingVenue;

    const { data, error } = await supabase
      .from("dbce_venue")
      .update(venueData)
      .match({ id })
      .select();
    if (error) {
      console.error("Error updating venue:", error);
      setError("Failed to update venue.");
    } else {
      fetchVenues(); // Refetch to get the generated value
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

  const renderRow = (venue) => {
    const isEditing = editingVenue?.id === venue.id;
    const currentData = isEditing ? editingVenue : venue;

    return (
      <tr key={venue.id}>
        <td>
          {isEditing
            ? renderInputField("venue_name", "Venue Name", true)
            : venue.venue_name}
        </td>
        <td>{isEditing ? renderInputField("city", "City", true) : venue.city}</td>
        <td>
          {isEditing
            ? renderInputField("total_capacity", "Total Capacity", true)
            : venue.total_capacity}
        </td>
        <td>
          {isEditing
            ? renderInputField("seat_kills", "Seat Kills", true)
            : venue.seat_kills}
        </td>
        <td>{isEditing ? renderInputField("comps", "Comps", true) : venue.comps}</td>
        <td>
          {isEditing
            ? renderInputField("producer_holds", "Producer Holds", true)
            : venue.producer_holds}
        </td>
        <td>{venue.total_sellable}</td>
        <td>
          {isEditing
            ? renderInputField("venue_rental", "Venue Rental", true)
            : formatCurrency(venue.venue_rental)}
        </td>
        <td>
          {isEditing
            ? renderInputField("extra_show_fee", "Extra Show Fee", true)
            : formatCurrency(venue.extra_show_fee)}
        </td>
        <td>
          {isEditing
            ? renderInputField("hourly_extra_rate", "Hourly Extra Rate", true)
            : formatCurrency(venue.hourly_extra_rate)}
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

  const renderLabeledInput = (key, label) => (
    <div className="form-group">
      <label>{label}</label>
      {renderInputField(key, label, false)}
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Manage Venues</h4>
      </div>
      <div className="card-body">
        <h5>Add New Venue</h5>
        <div className="add-item-form-grid">
          {renderLabeledInput("venue_name", "Venue Name")}
          {renderLabeledInput("city", "City")}
          {renderLabeledInput("total_capacity", "Total Capacity")}
          {renderLabeledInput("seat_kills", "Seat Kills")}
          {renderLabeledInput("comps", "Comps")}
          {renderLabeledInput("producer_holds", "Producer Holds")}
          {renderLabeledInput("venue_rental", "Venue Rental (£)")}
          {renderLabeledInput("extra_show_fee", "Extra Show Fee (£)")}
          {renderLabeledInput("hourly_extra_rate", "Hourly Extra Rate (£)")}
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
