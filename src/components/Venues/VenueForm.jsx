// Compliance: AI_LAW v1.1 — This component provides a modular form for venue creation and editing.
import React from 'react';
import { FaPlus } from "react-icons/fa";

const VenueForm = ({ newVenue, setNewVenue, handleAddVenue, renderInputField, error }) => {

    const renderLabeledInput = (key, label) => (
        <div className="form-group">
            <label>{label}</label>
            {renderInputField(key, label, false, newVenue, setNewVenue)}
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
            </div>
        </div>
    );
};

export default VenueForm;
