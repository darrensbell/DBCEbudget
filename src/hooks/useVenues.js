// Compliance: AI_LAW v1.1 — This hook encapsulates all venue-related logic, adhering to modularity and separation of concerns.
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export const useVenues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);

  const fetchVenues = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const validateVenue = (venue) => {
    if (!venue.venue_name?.trim() || !venue.city?.trim()) {
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
        const value = venue[field];
        if (value === null || value === '' || isNaN(Number(value))) {
            return `Please enter a valid number for ${field.replace(/_/g, " ")}.`;
        }
    }
    if (Number(venue.total_capacity) <= 0) {
      return "Total Capacity must be a positive number.";
    }
    return null;
  };

  const addVenue = async (newVenue) => {
    setError(null);
    const validationError = validateVenue(newVenue);
    if (validationError) {
      setError(validationError);
      return false;
    }

    const { error: insertError } = await supabase
      .from("dbce_venue")
      .insert([newVenue])
      .select();

    if (insertError) {
      console.error("Error adding venue:", insertError);
      setError("Failed to add venue.");
      return false;
    } else {
      await fetchVenues(); // Refetch to get the latest data
      return true;
    }
  };

  const updateVenue = async (editingVenue) => {
    setError(null);
    const validationError = validateVenue(editingVenue);
    if (validationError) {
      setError(validationError);
      return false;
    }

    const { id, ...venueData } = editingVenue;

    const { error: updateError } = await supabase
      .from("dbce_venue")
      .update(venueData)
      .match({ id })
      .select();

    if (updateError) {
      console.error("Error updating venue:", updateError);
      setError("Failed to update venue.");
      return false;
    } else {
      await fetchVenues(); // Refetch to get the latest data
      return true;
    }
  };

  const deleteVenue = async (id) => {
    const { error } = await supabase.from("dbce_venue").delete().match({ id });
    if (error) {
      console.error("Error deleting venue:", error);
      setError("Failed to delete venue.");
    } else {
      setVenues((prevVenues) => prevVenues.filter((v) => v.id !== id));
    }
  };

  return {
    venues,
    error,
    fetchVenues,
    addVenue,
    updateVenue,
    deleteVenue,
    setError,
  };
};
