import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ProductionModal({ show, onHide, onSave, production }) {
  const [formData, setFormData] = useState({
    production_artist_name: "",
    agent: "",
    agent_email_address: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (production) {
      setFormData({
        production_artist_name: production.production_artist_name || "",
        agent: production.agent || "",
        agent_email_address: production.agent_email_address || "",
      });
    } else {
      setFormData({
        production_artist_name: "",
        agent: "",
        agent_email_address: "",
      });
    }
    setError(null); // Reset error when modal opens or production changes
  }, [production, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.production_artist_name) {
      setError("Artist Name is a required field.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {production ? "Edit Production" : "Add New Production"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Artist Name</Form.Label>
            <Form.Control
              type="text"
              name="production_artist_name"
              value={formData.production_artist_name}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Agent</Form.Label>
            <Form.Control
              type="text"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Agent Email Address</Form.Label>
            <Form.Control
              type="email"
              name="agent_email_address"
              value={formData.agent_email_address}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Production
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductionModal;
