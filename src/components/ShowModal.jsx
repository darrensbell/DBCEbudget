import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { supabase } from '../lib/supabaseClient';

function ShowModal({ show, onHide, onSave, existingShow, productionId }) {
  const [formData, setFormData] = useState({});
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);

  // The database requires these exact, non-pluralized values.
  const statusOptions = ['option', 'confirm', 'roll'];

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.from('dbce_venue').select('id, venue_name');
      if (error) {
        console.error('Error fetching venues:', error);
      } else {
        setVenues(data);
      }
    };
    fetchVenues();

    // Set initial form data
    if (existingShow) {
      setFormData({
        local_date: existingShow.local_date || '',
        local_time: existingShow.local_time ? existingShow.local_time.substring(0, 5) : '19:30',
        status: existingShow.status || 'option',
        show_number: existingShow.show_number || 1,
        notes: existingShow.notes || '',
        venue_id: existingShow.venue_id || '',
      });
    } else {
      setFormData({
        local_date: new Date().toISOString().split('T')[0],
        local_time: '19:30',
        status: 'option', // Set correct default status
        show_number: 1,
        notes: '',
        venue_id: '',
      });
    }
    setError(null); // Reset error on open
  }, [existingShow, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.local_date || !formData.local_time) {
        setError('Date and Time are required fields.');
        return;
    }
    onSave({ ...formData, production_id: productionId });
  };

  return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{existingShow ? 'Edit Show' : 'Add New Show'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="local_date" value={formData.local_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" name="local_time" value={formData.local_time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Venue</Form.Label>
                <Form.Select name="venue_id" value={formData.venue_id} onChange={handleChange}>
                    <option value="">Select a Venue</option>
                    {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>{venue.venue_name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Show Number</Form.Label>
              <Form.Control type="number" name="show_number" value={formData.show_number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" value={formData.notes} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Show</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default ShowModal;
