import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { supabase } from '../lib/supabaseClient';

function ShowModal({ show, onHide, onSave, showData, productionId }) {
  const [formData, setFormData] = useState({
    local_date: '',
    local_time: '19:30',
    status: 'option',
    notes: '',
    venue_id: ''
  });
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch venues for dropdown
    const fetchVenues = async () => {
      const { data, error } = await supabase.from('dbce_venue').select('id, venue_name');
      if (!error) setVenues(data);
    };
    fetchVenues();

    if (showData) {
      setFormData({
        local_date: showData.local_date || '',
        local_time: showData.local_time || '19:30',
        status: showData.status || 'option',
        notes: showData.notes || '',
        venue_id: showData.venue_id || ''
      });
    } else {
      setFormData({
        local_date: '',
        local_time: '19:30',
        status: 'option',
        notes: '',
        venue_id: ''
      });
    }
  }, [showData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.local_date) {
      setError('Show date is required.');
      return;
    }
    setError('');
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{showData ? 'Edit Show' : 'Add New Show'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Show Date</Form.Label>
            <Form.Control type="date" name="local_date" value={formData.local_date} onChange={handleChange} autoFocus/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Show Time</Form.Label>
            <Form.Control type="time" name="local_time" value={formData.local_time} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control as="select" name="venue_id" value={formData.venue_id} onChange={handleChange}>
              <option value="">Select a Venue</option>
              {venues.map(v => <option key={v.id} value={v.id}>{v.venue_name}</option>)}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
              <option value="option">Option</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} name="notes" value={formData.notes} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShowModal;
