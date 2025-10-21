// Compliance: AI_LAW v1.1 - This component has been refactored to use the useRecoupment hook.
import React from 'react';
import { useRecoupment } from "../hooks/useRecoupment";
import Scenario from "../components/Scenario";
import { formatCurrency } from "../lib/currency";
import "../styles/Recoupment.css";

const RecoupmentPage = () => {
  const {
    production,
    totalCost,
    grossBoxOfficePotential,
    setGrossBoxOfficePotential,
    scenarios,
    activeScenario,
    loading,
    error,
    isSaving,
    handleSelectScenario,
    handleCreateScenario,
    handleUpdateScenario,
    handleDeleteScenario,
    calculateRecoupment,
    breakEvenPoint,
    capacityLevels,
  } = useRecoupment();

  if (loading) return <div role="alert" aria-live="polite">Loading recoupment data...</div>;
  if (error) return <div className="alert alert-danger" role="alert" aria-live="assertive">{error}</div>;
  if (!production) return <div role="alert">Production not found.</div>;

  const breakEven = breakEvenPoint();
  const allCapacities = [...capacityLevels, breakEven / 100].filter(c => c >= 0 && c <= 5);

  const renderRecoupmentRows = () => {
    const sortedCapacities = allCapacities.sort((a, b) => b - a);

    const formatHeader = (cap) => {
      if (cap === breakEven / 100) return 'Break Even';
      return `${(cap * 100).toFixed(2)}%`;
    };

    const recoupmentData = sortedCapacities.map(cap => calculateRecoupment(cap));

    return (
      <>
        <thead>
          <tr>
            <th scope="col">PRE-RECOUPMENT</th>
            {sortedCapacities.map((cap, i) => <th key={i} scope="col">{formatHeader(cap)}</th>)}
          </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">Gross Box Office Receipts</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.grossReceipts)}</td>)}
            </tr>
            <tr>
                <th scope="row">VAT [{((activeScenario?.vat_rate || 0.2) * 100).toFixed(0)}%]</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.vat)}</td>)}
            </tr>
            <tr>
                <th scope="row">Agent Commissions [{((activeScenario?.agent_commission_rate || 0.04) * 100).toFixed(0)}%]</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.agentCommission)}</td>)}
            </tr>
            <tr>
                <th scope="row">SOLT Levy [£{activeScenario?.solt_levy_amount || 0}]</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.soltLevy)}</td>)}
            </tr>
            <tr>
                <th scope="row">REST Levy [£{activeScenario?.rest_levy_per_seat || 0} per seat]</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.restLevy)}</td>)}
            </tr>
            <tr className="net-receipts">
                <th scope="row">Net Box Office Receipts</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.netBoxOffice)}</td>)}
            </tr>
            <tr>
                <th scope="row">Royalties [{((activeScenario?.royalty_rate || 0.042) * 100).toFixed(1)}%]</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.royalties)}</td>)}
            </tr>
            <tr>
                <th scope="row">Show Operating Surplus</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.showOperatingSurplus)}</td>)}
            </tr>
            <tr>
                <th scope="row">Show Operating Costs</th>
                {sortedCapacities.map((_cap, i) => <td key={i}>{formatCurrency(totalCost)}</td>)}
            </tr>
            <tr className="operating-profit">
                <th scope="row">Operating Profit</th>
                {recoupmentData.map((data, i) => <td key={i}>{formatCurrency(data.operatingProfit)}</td>)}
            </tr>
            <tr className="producer-profit">
                <th scope="row">Total Producer Profit</th>
                {recoupmentData.map((data, i) => <td key={i} className={data.producerProfit < 0 ? "text-danger" : ""}>{formatCurrency(data.producerProfit)}</td>)}
            </tr>
            <tr className="total-recouped">
                <th scope="row">TOTAL % RECOUPED:</th>
                {recoupmentData.map((data, i) => <td key={i}>{data.totalRecouped.toFixed(0)}%</td>)}
            </tr>
        </tbody>
      </>
    );
  };

  return (
    <div className="recoupment-page">
      <div className="visually-hidden" role="status" aria-live="polite">
        {isSaving ? 'Saving data...' : 'Data saved.'}
      </div>
      <header className='recoupment-header'>
        <h2 id="production-title">{production.production_artist_name}</h2>
        <h3>{activeScenario?.name || 'Recoupment Analysis'}</h3>
      </header>

      <Scenario 
        scenarios={scenarios}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onCreateScenario={handleCreateScenario}
        onUpdateScenario={handleUpdateScenario}
        onDeleteScenario={handleDeleteScenario}
      />

      <section className="recoupment-summary" aria-labelledby="summary-heading">
        <h3 id="summary-heading" className="visually-hidden">Recoupment Summary</h3>
        <div className="summary-item">
          <label htmlFor="gbo-input">Total GBOP {isSaving && <small className='saving-indicator' aria-hidden="true">Saving...</small>}</label>
          <input 
            id="gbo-input"
            type="number" 
            value={grossBoxOfficePotential} 
            onChange={(e) => setGrossBoxOfficePotential(parseFloat(e.target.value) || 0)}
            className="form-control"
            aria-describedby="gbo-description"
          />
          <p id="gbo-description" className="visually-hidden">Enter the Gross Box Office Potential</p>
        </div>
        <div className="summary-item">
          <p>Total Cost</p>
          <span>{formatCurrency(totalCost)}</span>
        </div>
        <div className="summary-item">
          <p>Total Capitalisation</p>
          <span>{formatCurrency(totalCost)}</span>
        </div>
        <div className="summary-item total-recoup">
          <p>Total To Recoup</p>
          <span>{formatCurrency(totalCost)}</span>
        </div>
      </section>

      <main className="recoupment-details" role="region" aria-labelledby="recoupment-table-heading">
        <h3 id="recoupment-table-heading" className="visually-hidden">Recoupment Details Table</h3>
        <table className="table table-bordered recoupment-table">
          {renderRecoupmentRows()}
        </table>
      </main>
    </div>
  );
}

export default RecoupmentPage;
