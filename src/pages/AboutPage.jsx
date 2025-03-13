import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Science, Description, Group, Email, CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/system';
import './AboutPage.css';

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6c5ce7 0%, #4ecdc4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="floating-shapes">
        {[...Array(5)].map((_, i) => <div key={i} className="shape"></div>)}
      </div>
      
      <Container maxWidth="lg" className="about-container">
        <GradientText variant="h2" align="center" gutterBottom className="main-title">
          About HealthTech 4 Africa
        </GradientText>
        
        <StyledPaper elevation={0} className="content-paper">
          <Grid container spacing={4}>
            {/* Project Overview Section */}
            <Grid item xs={12} md={6}>
              <Box className="section-header">
                <Science fontSize="large" className="section-icon" />
                <Typography variant="h4" className="section-title">
                  Technology Overview
                </Typography>
              </Box>
              <Typography variant="body1" className="section-text">
                Our advanced diagnostic system utilizes deep convolutional neural networks trained on over 100,000 annotated chest radiographs. The AI model detects 8 critical pulmonary conditions with 94.3% average accuracy:
              </Typography>
              <Grid container spacing={1} className="condition-grid">
                {['Pneumonia', 'Tuberculosis', 'Lung Cancer', 'COPD', 'Pulmonary Edema', 'Pneumothorax', 'Pulmonary Fibrosis', 'Pleural Effusion'].map((condition) => (
                  <Grid item xs={6} key={condition}>
                    <Box className="condition-item">
                      <CheckCircle fontSize="small" className="check-icon" />
                      <Typography variant="body2">{condition}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* User Guide Section */}
            <Grid item xs={12} md={6}>
              <Box className="section-header">
                <Description fontSize="large" className="section-icon" />
                <Typography variant="h4" className="section-title">
                  User Guide
                </Typography>
              </Box>
              <List dense={false} className="guide-list">
                {[
                  'Upload chest X-ray (JPEG/DICOM) via Home page',
                  'Receive AI analysis within 15-20 seconds',
                  'Review detailed diagnostic report',
                  'Access historical data in Dashboard',
                  'Explore condition info in Knowledge Base'
                ].map((text, index) => (
                  <ListItem key={text} className="guide-item">
                    <ListItemIcon>
                      <Avatar className="step-number">{index + 1}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Team Section */}
            <Grid item xs={12}>
              <Box className="section-header">
                <Group fontSize="large" className="section-icon" />
                <Typography variant="h4" className="section-title">
                  Development Team
                </Typography>
              </Box>
              <Grid container spacing={3} justifyContent="center">
                {[
                  { name: 'Dennis Kofi Nsiah', role: 'Machine learning Specialist', contact: 'research@gmail.com' },
                  { name: 'Obed Sarkodie', role: 'Software Engineer', contact: 'medical@gmail.com' },
                  { name: 'Thomas Kangah', role: 'Business Development Specialist', contact: 'business@gmail.com' },
                  { name: 'Geraldine Essilfu Enu', role: 'Lab Technicians', contact: 'labtech@gmail.com' },
                  
                ].map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Paper className="team-card">
                      <Avatar className="member-avatar">{member.name[0]}</Avatar>
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{member.role}</Typography>
                      <Box className="contact-info">
                        <Email fontSize="small" />
                        <Typography variant="body2">{member.contact}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    </div>
  );
};

export default AboutPage;