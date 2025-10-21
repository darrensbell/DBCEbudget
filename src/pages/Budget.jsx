import { useState, useEffect, useMemo, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";
import EditableCell from "../components/EditableCell";
import { formatCurrency } from "../lib/currency";
import "../styles/Budget.css";

const detailsOptions = ["NULL", "DAYS", "WEEKS", "ALLOWANCE", "BUYOUT", "FEE"];

function Budget() {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const showPromise = supabase
          .from("dbce_show")
          .select("*, production:dbce_production(production_artist_name)")
          .eq("id", showId)
          .single();
        const budgetPromise = supabase
          .from("dbce_show_budget_item")
          .select("*")
          .eq("show_id", showId)
          .order("id", { ascending: true });

        const [
          { data: showData, error: showError },
          { data: budgetData, error: budgetError },
        ] = await Promise.all([showPromise, budgetPromise]);

        if (showError) throw showError;
        if (budgetError) throw budgetError;

        setShow(showData);
        setBudgetItems(budgetData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load budget data: ${JSON.stringify(error, null, 2)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [showId]);

  const handleUpdate = async (itemId, field, value) => {
    const isNumeric = ["number", "rate"].includes(field);
    let parsedValue = value;
    if (isNumeric) {
      parsedValue = parseFloat(value) || 0;
    }

    const { error } = await supabase
      .from("dbce_show_budget_item")
      .update({ [field]: parsedValue })
      .match({ id: itemId });

    if (error) {
      console.error("Error updating item:", error);
      setError("Failed to save changes.");
    } else {
      setBudgetItems((items) =>
        items.map((item) =>
          item.id === itemId ? { ...item, [field]: parsedValue } : item,
        ),
      );
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this budget item?")) {
      const { error } = await supabase
        .from("dbce_show_budget_item")
        .delete()
        .match({ id: itemId });
      if (error) {
        console.error("Error deleting item:", error);
        setError("Failed to delete item.");
      } else {
        setBudgetItems((items) => items.filter((item) => item.id !== itemId));
      }
    }
  };

  const handleAddItem = async () => {
    const { data, error } = await supabase
      .from("dbce_show_budget_item")
      .insert([{ show_id: showId, summary_group: "Uncategorized" }])
      .select()
      .single();
    if (error) {
      console.error("Error adding item:", error);
      setError("Failed to add new item.");
    } else {
      setBudgetItems((currentItems) => [...currentItems, data]);
    }
  };

  const { groupedBudget, grandTotal, groupOrder } = useMemo(() => {
    const grouped = {};
    const groupOrder = [];
    let grandTotal = 0;

    budgetItems.forEach((item) => {
      const key = item.summary_group || "Uncategorized";
      if (!grouped[key]) {
        grouped[key] = { items: [], subtotal: 0 };
        groupOrder.push(key);
      }
      const itemTotal = (item.number || 0) * (item.rate || 0);
      grouped[key].items.push(item);
      grouped[key].subtotal += itemTotal;
      grandTotal += itemTotal;
    });

    return { groupedBudget: grouped, grandTotal, groupOrder };
  }, [budgetItems]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="alert alert-danger"><pre>{error}</pre></div>;
  if (!show) return <div>Show not found.</div>;

  return (
    <div className="budget-container">
      <div className="budget-header">
        <Link to="/productions" className="btn btn-light btn-round me-3">
          <FaArrowLeft /> Back
        </Link>
        <div className="flex-grow-1">
          <h2 className="mb-0">{show.production.production_artist_name}</h2>
          <p className="mb-0 text-muted">Show #{show.show_number} - Budget</p>
        </div>
        <button className="btn btn-primary btn-round" onClick={handleAddItem}>
          <FaPlus /> Add Item
        </button>
      </div>

      <div className="budget-table-container">
        <table className="table table-bordered table-hover budget-table">
          <thead className="table-light">
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>SUMMARY GROUP</th>
              <th>DEPARTMENT</th>
              <th>SUB-DEPARTMENT</th>
              <th>LINE ITEM</th>
              <th>DETAILS</th>
              <th>UNIT</th>
              <th>NUMBER</th>
              <th>RATE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {groupOrder.map((summaryGroup) => {
              const groupData = groupedBudget[summaryGroup];
              return (
                <Fragment key={summaryGroup}>
                  {groupData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center">
                        <FaTrash
                          className="delete-icon"
                          onClick={() => handleDelete(item.id)}
                        />
                      </td>
                      <EditableCell
                        value={item.summary_group}
                        onSave={(val) =>
                          handleUpdate(item.id, "summary_group", val)
                        }
                      />
                      <EditableCell
                        value={item.department}
                        onSave={(val) =>
                          handleUpdate(item.id, "department", val)
                        }
                      />
                      <EditableCell
                        value={item.sub_department}
                        onSave={(val) =>
                          handleUpdate(item.id, "sub_department", val)
                        }
                      />
                      <EditableCell
                        value={item.line_item}
                        onSave={(val) =>
                          handleUpdate(item.id, "line_item", val)
                        }
                      />
                      <EditableCell
                        value={item.details}
                        onSave={(val) => handleUpdate(item.id, "details", val)}
                        type="select"
                        options={detailsOptions}
                      />
                      <EditableCell
                        value={item.unit}
                        onSave={(val) => handleUpdate(item.id, "unit", val)}
                      />
                      <EditableCell
                        value={item.number}
                        onSave={(val) => handleUpdate(item.id, "number", val)}
                        type="number"
                      />
                      <EditableCell
                        value={item.rate}
                        onSave={(val) => handleUpdate(item.id, "rate", val)}
                        type="currency"
                      />
                      <td className="text-end table-secondary">
                        {formatCurrency((item.number || 0) * (item.rate || 0))}
                      </td>
                    </tr>
                  ))}
                  <tr
                    key={`${summaryGroup}-subtotal`}
                    className="department-header"
                  >
                    <td colSpan="9" className="text-end fw-bold">
                      {summaryGroup} Subtotal
                    </td>
                    <td className="text-end fw-bold table-secondary">
                      {formatCurrency(groupData.subtotal)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="grand-total-row">
              <td colSpan="9" className="text-end fw-bold">
                GRAND TOTAL
              </td>
              <td className="text-end fw-bold table-secondary">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Budget;
