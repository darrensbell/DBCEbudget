import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Scenario from "../components/Scenario";
import "../styles/Recoupment.css";
import { formatCurrency } from "../lib/currency";

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function RecoupmentPage() {
  const { productionId } = useParams();
  const [production, setProduction] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [grossBoxOfficePotential, setGrossBoxOfficePotential] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const capacityLevels = [1, 0.9, 0.8, 0.75, 0.7];

  const fetchRecoupmentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: productionData, error: productionError } = await supabase
        .from('dbce_production')
        .select('*, shows:dbce_show(*, budget_items:dbce_show_budget_item(*))')
        .eq('id', productionId)
        .single();

      if (productionError) throw productionError;
      setProduction(productionData);

      const total = productionData.shows.reduce((acc, show) => 
        acc + show.budget_items.reduce((sum, item) => sum + (item.number * item.rate), 0)
      , 0);
      setTotalCost(total);

      const { data: scenarioData, error: scenarioError } = await supabase
          .from('dbce_recoupment_scenarios')
          .select('*')
          .eq('production_id', productionId);
      
      if(scenarioError) throw scenarioError;

      if (scenarioData && scenarioData.length > 0) {
        setScenarios(scenarioData);
        setActiveScenario(scenarioData[0]);
        setGrossBoxOfficePotential(scenarioData[0].gross_box_office_potential || 0)
      } else {
        const { data: newScenario, error: newScenarioError } = await supabase
          .from('dbce_recoupment_scenarios')
          .insert({ production_id: productionId, name: 'Default Scenario' })
          .select()
        if(newScenarioError) throw newScenarioError;
        setScenarios(newScenario);
        setActiveScenario(newScenario[0]);
        setGrossBoxOfficePotential(newScenario[0].gross_box_office_potential || 0)
      }

    } catch (err) {
        setError(`Failed to fetch recoupment data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [productionId]);

  useEffect(() => {
    fetchRecoupmentData();
  }, [fetchRecoupmentData]);

  const updateGboDebounced = useCallback(
    debounce(async (value) => {
        if (!activeScenario) return;
      setIsSaving(true);
      const { error } = await supabase
        .from('dbce_recoupment_scenarios')
        .update({ gross_box_office_potential: value })
        .eq('id', activeScenario.id);
      if (error) {
        setError(`Failed to save GBOP: ${error.message}`);
      }
      setIsSaving(false);
    }, 500), 
    [activeScenario]
  );

  useEffect(() => {
    if (activeScenario) {
      updateGboDebounced(grossBoxOfficePotential);
    }
  }, [grossBoxOfficePotential, activeScenario, updateGboDebounced]);

  const handleSelectScenario = (scenario) => {
    if (scenario) {
      setActiveScenario(scenario);
      setGrossBoxOfficePotential(scenario.gross_box_office_potential || 0);
    }
  }

  const handleCreateScenario = async (scenarioData) => {
      const { data: newScenario, error } = await supabase
        .from('dbce_recoupment_scenarios')
        .insert({ ...scenarioData, production_id: productionId })
        .select();

      if(error) {
          setError(`Failed to create scenario: ${error.message}`);
          return;
      }

      setScenarios([...scenarios, newScenario[0]]);
      setActiveScenario(newScenario[0]);
      setGrossBoxOfficePotential(newScenario[0].gross_box_office_potential || 0);
  }

  const handleUpdateScenario = async (scenarioData) => {
      const { data: updatedScenario, error } = await supabase
        .from('dbce_recoupment_scenarios')
        .update(scenarioData)
        .eq('id', scenarioData.id)
        .select();
    
    if(error) {
        setError(`Failed to update scenario: ${error.message}`);
        return;
    }

    const updatedScenarios = scenarios.map(s => s.id === updatedScenario[0].id ? updatedScenario[0] : s);
    setScenarios(updatedScenarios);
    setActiveScenario(updatedScenario[0]);
    setGrossBoxOfficePotential(updatedScenario[0].gross_box_office_potential || 0);
  }

    const handleDeleteScenario = async (scenario) => {
        const { error } = await supabase
            .from('dbce_recoupment_scenarios')
            .delete()
            .eq('id', scenario.id);

        if (error) {
            setError(`Failed to delete scenario: ${error.message}`);
            return;
        }

        const updatedScenarios = scenarios.filter(s => s.id !== scenario.id);
        setScenarios(updatedScenarios);
        const nextActiveScenario = updatedScenarios.length > 0 ? updatedScenarios[0] : null;
        setActiveScenario(nextActiveScenario);

        if (nextActiveScenario) {
            setGrossBoxOfficePotential(nextActiveScenario.gross_box_office_potential || 0);
        } else {
            setGrossBoxOfficePotential(0);
        }
    };

  const calculateRecoupment = (capacity) => {
    const currentScenario = activeScenario || {};
    const grossReceipts = grossBoxOfficePotential * capacity;
    const vat = grossReceipts * (currentScenario.vat_rate || 0.20);
    const agentCommission = grossReceipts * (currentScenario.agent_commission_rate || 0.04);
    const soltLevy = currentScenario.solt_levy_amount || 0;
    const restLevy = (currentScenario.rest_levy_per_seat * currentScenario.number_of_seats) || 0;
    const netBoxOffice = grossReceipts - vat - agentCommission - soltLevy - restLevy;
    const royalties = netBoxOffice * (currentScenario.royalty_rate || 0.042);
    const showOperatingSurplus = netBoxOffice - royalties;
    const operatingProfit = showOperatingSurplus - totalCost;
    const producerProfit = operatingProfit;
    const totalRecouped = totalCost > 0 ? (producerProfit / totalCost) * 100 : 0;

    return {
        grossReceipts,
        vat,
        agentCommission,
        soltLevy,
        restLevy,
        netBoxOffice,
        royalties,
        showOperatingSurplus,
        operatingProfit,
        producerProfit,
        totalRecouped
    }
  }

  const breakEvenPoint = () => {
      const currentScenario = activeScenario || {};
      if (!grossBoxOfficePotential) return 0;

      const totalFixedCosts = totalCost; // Show Operating Costs
      const fixedDeductions = (currentScenario.solt_levy_amount || 0) + ((currentScenario.rest_levy_per_seat || 0) * (currentScenario.number_of_seats || 0));
      
      const vatRate = currentScenario.vat_rate || 0.20;
      const agentCommissionRate = currentScenario.agent_commission_rate || 0.04;
      const royaltyRate = currentScenario.royalty_rate || 0.042;

      const netMultiplier = 1 - royaltyRate;
      if (netMultiplier <= 0) return Infinity;

      const grossMultiplier = 1 - vatRate - agentCommissionRate;
      if (grossMultiplier <= 0) return Infinity;
      
      const breakEvenRevenue = ( (totalFixedCosts / netMultiplier) + fixedDeductions ) / grossMultiplier;

      const breakEvenCapacity = (breakEvenRevenue / grossBoxOfficePotential) * 100;
      
      return breakEvenCapacity;
  }

  if (loading) return <div role="alert" aria-live="polite">Loading recoupment data...</div>;
  if (error) return <div className="alert alert-danger" role="alert" aria-live="assertive">{error}</div>;
  if (!production) return <div role="alert">Production not found.</div>;

  const breakEven = breakEvenPoint();
  const allCapacities = [...capacityLevels, breakEven / 100].filter(c => c >= 0 && c <= 500); // Prevent extreme values

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
                <thead>
                    <tr>
                        <th scope="col">PRE-RECOUPMENT</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => (
                            <th key={i} scope="col">{cap === (breakEven / 100) ? 'Break Even' : ''} {(cap * 100).toFixed(2)}%</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Gross Box Office Receipts</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).grossReceipts)}</td>)}
                    </tr>
                     <tr>
                        <th scope="row">VAT [{((activeScenario?.vat_rate || 0.2) * 100).toFixed(0)}%]</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).vat)}</td>)}
                    </tr>
                    <tr>
                        <th scope="row">Agent Commissions [{((activeScenario?.agent_commission_rate || 0.04) * 100).toFixed(0)}%]</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).agentCommission)}</td>)}
                    </tr>
                    <tr>
                        <th scope="row">SOLT Levy [£{activeScenario?.solt_levy_amount || 0}]</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).soltLevy)}</td>)}
                    </tr>
                     <tr>
                        <th scope="row">REST Levy [£{activeScenario?.rest_levy_per_seat || 0} per seat]</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).restLevy)}</td>)}
                    </tr>
                    <tr className="net-receipts">
                        <th scope="row">Net Box Office Receipts</th>
                         {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).netBoxOffice)}</td>)}
                    </tr>
                    <tr>
                        <th scope="row">Royalties [{((activeScenario?.royalty_rate || 0.042) * 100).toFixed(1)}%]</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).royalties)}</td>)}
                    </tr>
                    <tr>
                        <th scope="row">Show Operating Surplus</th>
                         {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).showOperatingSurplus)}</td>)}
                    </tr>
                    <tr>
                        <th scope="row">Show Operating Costs</th>
                         {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(totalCost)}</td>)}
                    </tr>
                    <tr className="operating-profit">
                        <th scope="row">Operating Profit</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{formatCurrency(calculateRecoupment(cap).operatingProfit)}</td>)}
                    </tr>
                    <tr className="producer-profit">
                        <th scope="row">Total Producer Profit</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i} className={calculateRecoupment(cap).producerProfit < 0 ? "text-danger" : ""}>{formatCurrency(calculateRecoupment(cap).producerProfit)}</td>)}
                    </tr>
                    <tr className="total-recouped">
                        <th scope="row">TOTAL % RECOUPED @ 100% CAPACITY:</th>
                        {allCapacities.sort((a,b) => b-a).map((cap, i) => <td key={i}>{calculateRecoupment(cap).totalRecouped.toFixed(0)}%</td>)}
                    </tr>
                </tbody>
            </table>
        </main>
    </div>
  );
}

export default RecoupmentPage;
