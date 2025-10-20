import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import "./Settings.css";

function CategorySettings() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    summary_group: "",
    department: "",
    sub_department: "",
    line_item: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("dbce_categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching categories:", error);
      setError("Could not fetch categories.");
    } else {
      setCategories(data);
    }
  };

  const validateCategory = (category) => {
    if (
      !category.summary_group.trim() ||
      !category.department.trim() ||
      !category.line_item.trim()
    ) {
      return "Summary Group, Department, and Line Item cannot be empty.";
    }
    return null;
  };

  const handleAddCategory = async () => {
    setError(null);
    const validationError = validateCategory(newCategory);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { data, error } = await supabase
      .from("dbce_categories")
      .insert([newCategory])
      .select();
    if (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category.");
    } else {
      setCategories([data[0], ...categories]);
      setNewCategory({
        summary_group: "",
        department: "",
        sub_department: "",
        line_item: "",
      });
    }
  };

  const handleUpdateCategory = async (id) => {
    setError(null);
    const validationError = validateCategory(editingCategory);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { data, error } = await supabase
      .from("dbce_categories")
      .update(editingCategory)
      .match({ id })
      .select();
    if (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category.");
    } else {
      setCategories(categories.map((c) => (c.id === id ? data[0] : c)));
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    const { error } = await supabase
      .from("dbce_categories")
      .delete()
      .match({ id });
    if (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category.");
    } else {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const startEditing = (category) => {
    setEditingCategory({ ...category });
    setError(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Manage Categories</h4>
      </div>
      <div className="card-body">
        <div className="add-item-form">
          <input
            type="text"
            className="form-control"
            placeholder="Summary Group"
            value={newCategory.summary_group}
            onChange={(e) =>
              setNewCategory({ ...newCategory, summary_group: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Department"
            value={newCategory.department}
            onChange={(e) =>
              setNewCategory({ ...newCategory, department: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Sub-Department"
            value={newCategory.sub_department}
            onChange={(e) =>
              setNewCategory({ ...newCategory, sub_department: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Line Item"
            value={newCategory.line_item}
            onChange={(e) =>
              setNewCategory({ ...newCategory, line_item: e.target.value })
            }
          />
          <button
            className="btn btn-primary btn-round"
            onClick={handleAddCategory}
          >
            <FaPlus /> Add
          </button>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="table-responsive">
          <table className="table">
            <thead className="text-primary">
              <tr>
                <th>Summary Group</th>
                <th>Department</th>
                <th>Sub-Department</th>
                <th>Line Item</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingCategory.summary_group}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            summary_group: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.summary_group
                    )}
                  </td>
                  <td>
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingCategory.department}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            department: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.department
                    )}
                  </td>
                  <td>
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingCategory.sub_department}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            sub_department: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.sub_department
                    )}
                  </td>
                  <td>
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingCategory.line_item}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            line_item: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.line_item
                    )}
                  </td>
                  <td className="text-right">
                    {editingCategory?.id === category.id ? (
                      <>
                        <button
                          className="btn btn-success btn-round btn-icon"
                          onClick={() => handleUpdateCategory(category.id)}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="btn btn-secondary btn-round btn-icon"
                          onClick={() => setEditingCategory(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-round btn-icon"
                          onClick={() => startEditing(category)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-round btn-icon"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategorySettings;
