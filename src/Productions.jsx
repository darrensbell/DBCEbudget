import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ProductionModal from './components/ProductionModal';
import ShowModal from './components/ShowModal';
import ConfirmModal from './components/ConfirmModal';
import './Productions.css';

function Productions() {
  const [productions, setProductions] = useState([]);
  const [error, setError] = useState(null);
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [editingProduction, setEditingProduction] = useState(null);
  const [showShowModal, setShowShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [activeProductionId, setActiveProductionId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'production' or 'show'

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    const { data, error } = await supabase
      .from('dbce_production')
      .select('*, shows:dbce_show(*)')
      .order('created_at', { ascending: false })
      .order('show_number', { foreignTable: 'shows', ascending: true });

    if (error) {
      console.error('Error fetching productions:', error);
      setError('Could not fetch productions.');
    } else {
      setProductions(data);
    }
  };

  const handleSaveProduction = async (formData) => {
    setError(null);
    const { error } = editingProduction
      ? await supabase.from('dbce_production').update(formData).match({ id: editingProduction.id })
      : await supabase.from('dbce_production').insert([formData]);

    if (error) {
      console.error('Error saving production:', error);
      setError('Failed to save production.');
    } else {
      fetchProductions();
      closeProductionModal();
    }
  };

  const handleSaveShow = async (formData) => {
    setError(null);
    const showPayload = { ...formData, production_id: activeProductionId };
    if (showPayload.venue_id === '') showPayload.venue_id = null;

    if (editingShow) {
      const { error } = await supabase.from('dbce_show').update(showPayload).match({ id: editingShow.id });
      if (error) {
        console.error('Error updating show:', error);
        setError('Failed to update show.');
      }
    } else {
      const { data: shows, error: numError } = await supabase.from('dbce_show').select('show_number').eq('production_id', activeProductionId).order('show_number', { ascending: false }).limit(1);
      if (numError) { console.error('Error fetching show number', numError); setError('Failed to create show.'); return; }
      showPayload.show_number = (shows[0]?.show_number || 0) + 1;

      const { data: newShow, error: insertError } = await supabase.from('dbce_show').insert(showPayload).select().single();
      if (insertError) { console.error('Error creating show', insertError); setError('Failed to create show.'); return; }

      const { data: cats, error: catError } = await supabase.from('dbce_categories').select('*');
      if (catError) { console.error('Error fetching categories', catError); setError('Show created, but budget generation failed.'); return; }

      const budgetItems = cats.map(c => ({ show_id: newShow.id, summary_group: c.summary_group, department: c.department, sub_department: c.sub_department, line_item: c.line_item, unit: 'unit', number: 1, rate: 0, notes: c.notes }));
      const { error: budgetError } = await supabase.from('dbce_show_budget_item').insert(budgetItems);
      if (budgetError) { console.error('Error creating budget items', budgetError); setError('Show created, but budget generation failed.'); }
    }
    fetchProductions();
    closeShowModal();
  };

  const handleDeleteProduction = async (production) => {
    setError(null);
    const showIds = production.shows.map(s => s.id);
    if (showIds.length > 0) {
        await supabase.from('dbce_show_budget_item').delete().in('show_id', showIds);
        await supabase.from('dbce_show').delete().in('id', showIds);
    }
    const { error } = await supabase.from('dbce_production').delete().match({ id: production.id });
    if (error) {
        console.error('Error deleting production:', error);
        setError('Failed to delete production.');
    }
    closeConfirmModal();
    fetchProductions();
  };

  const handleDeleteShow = async (show) => {
    setError(null);
    await supabase.from('dbce_show_budget_item').delete().match({ show_id: show.id });
    const { error } = await supabase.from('dbce_show').delete().match({ id: show.id });
    if (error) {
        console.error('Error deleting show:', error);
        setError('Failed to delete show.');
    }
    closeConfirmModal();
    fetchProductions();
  };

  const openProductionModal = (prod = null) => { setEditingProduction(prod); setShowProductionModal(true); };
  const closeProductionModal = () => { setEditingProduction(null); setShowProductionModal(false); };
  const openShowModal = (prodId, show = null) => { setActiveProductionId(prodId); setEditingShow(show); setShowShowModal(true); };
  const closeShowModal = () => { setActiveProductionId(null); setEditingShow(null); setShowShowModal(false); };
  const openConfirmModal = (item, type) => { setItemToDelete(item); setDeleteType(type); setShowConfirmModal(true); };
  const closeConfirmModal = () => { setItemToDelete(null); setDeleteType(null); setShowConfirmModal(false); };

  const handleConfirmDelete = () => {
      if (!itemToDelete || !deleteType) return;
      if (deleteType === 'production') handleDeleteProduction(itemToDelete);
      if (deleteType === 'show') handleDeleteShow(itemToDelete);
  };

  return (
    <div className="productions-container">
      <div className="productions-header">
        <h2>Productions</h2>
        <button className="btn btn-primary btn-round" onClick={() => openProductionModal()}>
          <FaPlus /> Add Production
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="productions-grid">
        {productions.map(production => (
          <div key={production.id} className="card production-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">{production.production_artist_name}</h4>
              <div>
                <button className="btn btn-warning btn-round btn-icon" onClick={() => openProductionModal(production)}><FaEdit /></button>
                <button className="btn btn-danger btn-round btn-icon ms-2" onClick={() => openConfirmModal(production, 'production')}><FaTrash /></button>
              </div>
            </div>
            <div className="card-body">
                <p className="mb-1"><strong>Agent:</strong> {production.agent || 'N/A'}</p>
                <p><strong>Email:</strong> {production.agent_email_address || 'N/A'}</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Shows</h5>
                    <button className="btn btn-success btn-round btn-sm" onClick={() => openShowModal(production.id)}><FaPlus /> Add Show</button>
                </div>
                {production.shows.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                    {production.shows.map(show => (
                        <li key={show.id} className="show-item">
                        <span>Show #{show.show_number} - {new Date(show.local_date).toLocaleDateString()}</span>
                        <div className="show-item-buttons">
                            <Link to={`/budget/${show.id}`} className="btn btn-info btn-sm">Budget</Link>
                            <button className="btn btn-warning btn-sm btn-icon" onClick={() => openShowModal(production.id, show)}><FaEdit /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => openConfirmModal(show, 'show')}><FaTrash /></button>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p>No shows for this production yet.</p>
                )}
            </div>
          </div>
        ))}
      </div>

      <ProductionModal show={showProductionModal} onHide={closeProductionModal} onSave={handleSaveProduction} production={editingProduction} />
      <ShowModal show={showShowModal} onHide={closeShowModal} onSave={handleSaveShow} showData={editingShow} productionId={activeProductionId} />
      <ConfirmModal 
        show={showConfirmModal} 
        onHide={closeConfirmModal} 
        onConfirm={handleConfirmDelete} 
        title={`Delete ${deleteType}`}
        body={`Are you sure you want to permanently delete this ${deleteType}? This action cannot be undone.`}
      />
    </div>
  );
}

export default Productions;
