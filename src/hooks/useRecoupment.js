// Compliance: AI_LAW v1.1 - This hook encapsulates all recoupment-related logic.
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export const useRecoupment = () => {
  const { productionId } = useParams();
  const [production, setProduction] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [grossBoxOfficePotential, setGrossBoxOfficePotential] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  return {
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
    capacityLevels: [1, 0.9, 0.8, 0.75, 0.7],
  };
};
