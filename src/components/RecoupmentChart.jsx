import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

const formatCurrencyForChart = (value) => {
    if (Math.abs(value) > 1000) {
        return `£${(value / 1000).toFixed(0)}k`;
    }
    return `£${value}`;
};

function RecoupmentChart({ data }) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
            Profitability Analysis
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
            data={data}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrencyForChart} />
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)}/>
            <Legend />
            <Bar dataKey="Operating Profit" fill="#8884d8" />
            <Bar dataKey="Total Cost" fill="#82ca9d" />
        </BarChart>
        </ResponsiveContainer>
    </Paper>
  );
}

export default RecoupmentChart;
