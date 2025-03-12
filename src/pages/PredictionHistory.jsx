import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Box, Button } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { styled } from '@mui/system';
import axiosInstance from '../api/axiosInstance';
import { TrendingUp, History, InsertChart } from '@mui/icons-material';
import './PredictionHistory.css';

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6c5ce7 0%, #4ecdc4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: 'rgba(108, 92, 231, 0.05) !important',
  },
}));

const PredictionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/prediction-history')
      .then(response => {
        setHistory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });
  }, []);

  // Prepare chart data from history
  const chartData = history.length > 0 ? history.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    confidence: item.confidence
  })) : Array.from({ length: 5 }, (_, i) => ({
    time: `${10 + i}:00`,
    confidence: 70 + (i * 5)
  }));

  // Download stats as CSV file
  const downloadStats = () => {
    if (history.length === 0) return;
    let csvContent = "Timestamp,Diagnosis,Confidence\n";
    history.forEach(row => {
      const time = new Date(row.timestamp).toLocaleString();
      const diagnosis = row.diseaseDetected ? row.diseaseType : 'No Pathology Detected';
      csvContent += `${time},${diagnosis},${row.confidence}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stats_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="history-page">
      <div className="floating-dots">
        {[...Array(20)].map((_, i) => <div key={i} className="dot"></div>)}
      </div>
      
      <Container className="history-container">
        <Box className="header-section">
          <GradientText variant="h2" className="main-title">
            <InsertChart className="header-icon" />
            Diagnostic Analytics
          </GradientText>
          <Typography variant="subtitle1" className="subtitle">
            Historical Predictions & Performance Metrics
          </Typography>
        </Box>

        <Paper className="chart-container">
          <Box className="chart-header">
            <TrendingUp className="chart-icon" />
            <Typography variant="h5">Confidence Trend Analysis</Typography>
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30,30,45,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#6c5ce7"
                strokeWidth={2}
                dot={{ fill: '#4ecdc4', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="confidence"
                fill="url(#confidenceGradient)"
                strokeWidth={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="table-container">
          <Box className="table-header">
            <History className="table-icon" />
            <Typography variant="h5">Prediction History</Typography>
          </Box>
          {loading ? (
            <LinearProgress className="loading-bar" />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="table-head">Timestamp</TableCell>
                    <TableCell className="table-head">Diagnosis</TableCell>
                    <TableCell className="table-head">Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((row, index) => (
                    <StyledTableRow key={index}>
                      <TableCell className="table-cell">
                        {new Date(row.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="table-cell">
                        <span className={`diagnosis-tag ${row.diseaseDetected ? 'positive' : 'negative'}`}>
                          {row.diseaseDetected ? row.diseaseType : 'No Pathology Detected'}
                        </span>
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="confidence-meter">
                          <div 
                            className="meter-fill" 
                            style={{ width: `${row.confidence}%` }}
                          />
                          <span>{row.confidence}%</span>
                        </div>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={downloadStats}>
              Download Stats
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default PredictionHistory;
