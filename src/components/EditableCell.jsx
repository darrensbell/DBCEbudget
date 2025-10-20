import { useState, useEffect } from "react";
import { formatCurrency } from "../lib/currency";

function EditableCell({ value, onSave, type = "text", options = [] }) {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    // Handle NULL from DB for select dropdowns
    const initialValue = value === null && type === "select" ? "NULL" : value;
    setCurrentValue(initialValue);
  }, [value, type]);

  const handleClick = () => {
    if (type !== "display") {
      setEditing(true);
    }
  };

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleSave = () => {
    // If user selects 'NULL' in dropdown, save it as a real null
    const valueToSave =
      currentValue === "NULL" && type === "select" ? null : currentValue;
    onSave(valueToSave);
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const displayValue = () => {
    if (value === null || typeof value === "undefined") {
      return type === "select" ? "NULL" : "";
    }
    if (type === "currency") {
      return formatCurrency(value);
    }
    return String(value);
  };

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={currentValue || ""}
          onChange={handleChange}
          onBlur={handleSave}
          autoFocus
          className="form-control form-control-sm"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={type === "currency" ? "number" : "text"}
        value={currentValue || ""}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyPress={handleKeyPress}
        autoFocus
        step={type === "currency" ? "0.01" : undefined}
        className="form-control form-control-sm"
      />
    );
  };

  return (
    <td onClick={!editing ? handleClick : undefined} className="editable-cell">
      {editing ? renderInput() : <span>{displayValue()}</span>}
    </td>
  );
}

export default EditableCell;
