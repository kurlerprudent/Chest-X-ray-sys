import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, LinearProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Timeline, PieChart, TrendingUp } from '@mui/icons-material';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageInferenceTime: 0,
    successfulUploads: 0,
    accuracyRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulateApiCall = setTimeout(() => {
      setStats({
        totalPredictions: 124,
        averageInferenceTime: 1.2,
        successfulUploads: 100,
        accuracyRate: 94.5,
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(simulateApiCall);
  }, []);

  const GradientCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(145deg, rgba(40,40,55,0.9) 0%, rgba(30,30,45,0.9) 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `linear-gradient(
        45deg,
        transparent,
        rgba(108, 92, 231, 0.1),
        transparent
      )`,
      transform: 'rotate(45deg)',
      transition: 'all 0.6s',
    },
    '&:hover:before': {
      top: '50%',
      left: '50%',
    },
  }));

  const StatCard = ({ title, value, icon, trend }) => (
    <GradientCard className="stat-card">
      <CardContent>
        <Box className="card-header">
          {React.cloneElement(icon, { className: 'card-icon' })}
          <Typography variant="h6" className="card-title">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" className="card-value">
          {value}
          {trend && <span className={`trend ${trend}`}>{trend === 'up' ? '↑' : '↓'}</span>}
        </Typography>
        {title.includes('Accuracy') && (
          <LinearProgress 
            variant="determinate" 
            value={value} 
            className="accuracy-bar"
          />
        )}
      </CardContent>
    </GradientCard>
  );

  return (
    <div className="dashboard-page">
      <div className="particle-background">
        {[...Array(15)].map((_, i) => <div key={i} className="particle"></div>)}
      </div>
      
      <Container className="dashboard-container">
        <Box className="header-section">
          <Typography variant="h2" className="dashboard-title">
            <span className="gradient-text">Analytics Dashboard</span>
          </Typography>
          <Typography variant="subtitle1" className="dashboard-subtitle">
            Comprehensive overview of diagnostic performance metrics
          </Typography>
        </Box>

        {loading ? (
          <Box className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </Box>
        ) : (
          <Grid container spacing={3} className="stats-grid">
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Predictions"
                value={stats.totalPredictions}
                icon={<Timeline fontSize="large" />}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Avg. Inference"
                value={`${stats.averageInferenceTime}s`}
                icon={<PieChart fontSize="large" />}
                trend="down"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Successful Uploads"
                value={stats.successfulUploads}
                icon={<TrendingUp fontSize="large" />}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Accuracy Rate"
                value={`${stats.accuracyRate}%`}
                icon={<TrendingUp fontSize="large" />}
              />
            </Grid>
          </Grid>
        )}

        <div className="divider"></div>

        <Box className="chart-container">
          <Typography variant="h5" className="chart-title">
            Weekly Prediction Trends
          </Typography>
          <div className="mock-chart"></div>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;