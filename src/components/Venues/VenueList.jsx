// Compliance: AI_LAW v1.1 — This component is a modular, display-only list for venues.
import React from 'react';
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { formatCurrency } from "../../lib/currency";

const VenueList = ({ 
    venues, 
    editingVenue, 
    startEditing, 
    handleUpdateVenue, 
    setEditingVenue, 
    handleDeleteVenue,
    renderInputField
}) => {

    const renderRow = (venue) => {
        const isEditing = editingVenue?.id === venue.id;

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

    return (
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
    );
};

export default VenueList;
