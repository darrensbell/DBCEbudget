import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { formatCurrency } from '../lib/currency';

function Dashboard() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBudgets, setTotalBudgets] = useState({});

  useEffect(() => {
    const fetchProductionsAndBudgets = async () => {
      setLoading(true);
      try {
        const { data: productionsData, error: productionsError } = await supabase
          .from('dbce_production')
          .select(`
            id,
            production_artist_name,
            shows:dbce_show(
                budget_items:dbce_show_budget_item(number, rate)
            )
          `)
          .order('created_at', { ascending: false });

        if (productionsError) throw productionsError;
        
        const safeProductions = productionsData || [];
        setProductions(safeProductions);

        const budgets = {};
        safeProductions.forEach(production => {
            const total = production.shows.reduce((showAcc, show) => {
                return showAcc + show.budget_items.reduce((itemAcc, item) => {
                    return itemAcc + ((item.number || 0) * (item.rate || 0));
                }, 0);
            }, 0);
            budgets[production.id] = total;
        });

        setTotalBudgets(budgets);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch productions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionsAndBudgets();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h2" gutterBottom component="h1" sx={{ color: 'text.primary', mb: 4}}>
            Productions
        </Typography>
      {productions.length === 0 ? (
        <Alert severity="info">No productions found. Get started by creating a new one!</Alert>
      ) : (
        <Grid container spacing={4}>
            {productions.map((production) => (
            <Grid item xs={12} sm={6} md={4} key={production.id}>
                <Card>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="div" gutterBottom noWrap>
                        {production.production_artist_name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Total Budget: {formatCurrency(totalBudgets[production.id])}
                        </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 1, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        <Button 
                            variant="contained" 
                            component={Link} 
                            to={`/budget/${production.id}`}>
                            Manage Budget
                        </Button>
                        <Button 
                            variant="outlined" 
                            component={Link} 
                            to={`/recoupment/${production.id}`}>
                            Recoupment
                        </Button>
                    </Box>
                </Card>
            </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;
