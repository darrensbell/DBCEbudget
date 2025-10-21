import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ScenarioModal from './ScenarioModal';
import ConfirmModal from './ConfirmModal';
import '../styles/Scenario.css';

function Scenario({ 
    scenarios,
    activeScenario,
    onSelectScenario,
    onCreateScenario,
    onUpdateScenario,
    onDeleteScenario
}) {
    const [showScenarioModal, setShowScenarioModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editingScenario, setEditingScenario] = useState(null);

    const openScenarioModal = (scenario = null) => {
        setEditingScenario(scenario);
        setShowScenarioModal(true);
    };

    const closeScenarioModal = () => {
        setEditingScenario(null);
        setShowScenarioModal(false);
    };

    const openConfirmModal = () => {
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
    };

    const handleSave = (scenarioData) => {
        if (editingScenario) {
            onUpdateScenario({ ...editingScenario, ...scenarioData });
        } else {
            onCreateScenario(scenarioData);
        }
        closeScenarioModal();
    };

    const handleDelete = () => {
        onDeleteScenario(activeScenario);
        closeConfirmModal();
    };

    return (
        <div className="scenario-container">
            <div className="scenario-selector">
                <label htmlFor="scenario-select" className="visually-hidden">Select a Scenario</label>
                <select 
                    id="scenario-select"
                    className="form-select"
                    value={activeScenario ? activeScenario.id : ''}
                    onChange={(e) => onSelectScenario(scenarios.find(s => s.id === e.target.value))}
                    aria-label="Select a scenario"
                >
                    {scenarios.map(scenario => (
                        <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
                    ))}
                </select>
            </div>
            <div className="scenario-actions">
                <button className="btn btn-success btn-icon" onClick={() => openScenarioModal()} aria-label="Create new scenario">
                    <FaPlus />
                </button>
                {activeScenario && (
                    <>
                        <button className="btn btn-warning btn-icon" onClick={() => openScenarioModal(activeScenario)} aria-label="Edit current scenario">
                            <FaEdit />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={openConfirmModal} aria-label="Delete current scenario">
                            <FaTrash />
                        </button>
                    </>
                )}
            </div>

            <ScenarioModal 
                show={showScenarioModal}
                onHide={closeScenarioModal}
                onSave={handleSave}
                scenario={editingScenario}
            />

            <ConfirmModal
                show={showConfirmModal}
                onHide={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Scenario"
                body="Are you sure you want to permanently delete this scenario? This action cannot be undone."
            />
        </div>
    );
}

export default Scenario;
