import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProductionModal({ show, onHide, onSave, production }) {
  const [formData, setFormData] = useState({ production_artist_name: '', agent: '', agent_email_address: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // If a production is passed, we are in 'edit' mode
    if (production) {
      setFormData({
        production_artist_name: production.production_artist_name || '',
        agent: production.agent || '',
        agent_email_address: production.agent_email_address || ''
      });
    } else {
      // Otherwise, we are in 'add' mode
      setFormData({ production_artist_name: '', agent: '', agent_email_address: '' });
    }
  }, [production, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.production_artist_name.trim()) {
      setError('Artist Name is required.');
      return;
    }
    setError('');
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{production ? 'Edit Production' : 'Add New Production'}</Modal.Title>
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
          <Form.Gourp className="mb-3">
            <Form.Label>Agent Email</Form.Label>
            <Form.Control
              type="email"
              name="agent_email_address"
              value={formData.agent_email_address}
              onChange={handleChange}
            />
          </Form.Gourp>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductionModal;
