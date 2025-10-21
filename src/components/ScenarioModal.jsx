import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/ScenarioModal.css';

function ScenarioModal({ show, onHide, onSave, scenario }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (scenario) {
            setFormData(scenario);
        } else {
            setFormData({
                name: 'New Scenario',
                vat_rate: 0.20,
                agent_commission_rate: 0.04,
                royalty_rate: 0.042,
                solt_levy_amount: 0,
                rest_levy_per_seat: 0,
                number_of_seats: 0,
            });
        }
    }, [scenario, show]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{scenario ? 'Edit Scenario' : 'Create Scenario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Scenario Name</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>VAT Rate (%)</label>
                    <input type="number" name="vat_rate" value={(formData.vat_rate || 0) * 100} onChange={(e) => handleChange({target: {name: 'vat_rate', value: parseFloat(e.target.value) / 100, type: 'number'}})} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Agent Commission Rate (%)</label>
                    <input type="number" name="agent_commission_rate" value={(formData.agent_commission_rate || 0) * 100} onChange={(e) => handleChange({target: {name: 'agent_commission_rate', value: parseFloat(e.target.value) / 100, type: 'number'}})} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Royalty Rate (%)</label>
                    <input type="number" name="royalty_rate" value={(formData.royalty_rate || 0) * 100} onChange={(e) => handleChange({target: {name: 'royalty_rate', value: parseFloat(e.target.value) / 100, type: 'number'}})} className="form-control" />
                </div>
                <div className="form-group">
                    <label>SOLT Levy Amount (£)</label>
                    <input type="number" name="solt_levy_amount" value={formData.solt_levy_amount || 0} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>REST Levy per Seat (£)</label>
                    <input type="number" name="rest_levy_per_seat" value={formData.rest_levy_per_seat || 0} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Number of Seats</label>
                    <input type="number" name="number_of_seats" value={formData.number_of_seats || 0} onChange={handleChange} className="form-control" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ScenarioModal;
