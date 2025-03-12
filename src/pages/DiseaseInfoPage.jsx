import React from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { 
    LocalHospital,       // For Hospital
    Favorite,            // For HeartPulse
    Air,                 // For AirIcon
    Whatshot,            // For Thermometer
    Healing,             // For Pill
    Coronavirus,         // For LungIcon
    MonitorHeart,        // For Lungs
    FavoriteBorder       // Alternative for Stethoscope
  } from '@mui/icons-material';
import './DiseaseInfoPage.css';

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(108, 92, 231, 0.2)',
  borderRadius: '15px !important',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: '#6c5ce7',
  },
}));

const DiseaseInfoPage = () => {
    const diseaseIcons = [
        <Whatshot fontSize="large" />,          // Pneumonia
        <Coronavirus fontSize="large" />,       // Tuberculosis
        <Air fontSize="large" />,               // Lung Cancer
        <Favorite fontSize="large" />,          // COPD
        <MonitorHeart fontSize="large" />,      // Pulmonary Edema
        <LocalHospital fontSize="large" />,     // Pneumothorax
        <Healing fontSize="large" />,           // Pulmonary Fibrosis
        <FavoriteBorder fontSize="large" />     // Pleural Effusion
      ];
      
    // Added missing diseases array with necessary data
    const diseases = [
      {
        name: "Pneumonia",
        definition: "An infection that inflames the air sacs in one or both lungs, causing them to fill with fluid.",
        symptoms: ["Chest pain", "Cough with phlegm", "Fever and chills", "Shortness of breath"],
        treatment: "Treatment includes antibiotics for bacterial pneumonia, rest, and increased fluid intake.",
        resources: [
          { label: "Learn More", link: "https://www.mayoclinic.org/diseases-conditions/pneumonia/symptoms-causes/syc-20354204" }
        ]
      },
      {
        name: "Tuberculosis",
        definition: "A bacterial infection caused by Mycobacterium tuberculosis that primarily affects the lungs.",
        symptoms: ["Coughing blood", "Night sweats", "Weight loss", "Persistent cough"],
        treatment: "Treatment typically involves a 6-9 month regimen of multiple antibiotics.",
        resources: [
          { label: "Learn More", link: "https://www.cdc.gov/tb/default.htm" }
        ]
      },
      {
        name: "Lung Cancer",
        definition: "A type of cancer that begins in the lungs, usually in the cells lining the air passages.",
        symptoms: ["Persistent cough", "Coughing up blood", "Chest pain", "Hoarseness"],
        treatment: "Treatment may include surgery, chemotherapy, radiation therapy, and immunotherapy.",
        resources: [
          { label: "Learn More", link: "https://www.cancer.org/cancer/lung-cancer.html" }
        ]
      },
      {
        name: "COPD",
        definition: "Chronic Obstructive Pulmonary Disease is a group of lung diseases that block airflow and make breathing difficult.",
        symptoms: ["Shortness of breath", "Chronic cough", "Wheezing", "Frequent respiratory infections"],
        treatment: "Treatment includes bronchodilators, steroids, and pulmonary rehabilitation.",
        resources: [
          { label: "Learn More", link: "https://www.nhlbi.nih.gov/health-topics/copd" }
        ]
      },
      {
        name: "Pulmonary Edema",
        definition: "Abnormal buildup of fluid in the lungs, causing difficulty breathing.",
        symptoms: ["Shortness of breath", "Pink frothy sputum", "Anxiety", "Excessive sweating"],
        treatment: "Treatment includes oxygen therapy, diuretics, and addressing the underlying cause.",
        resources: [
          { label: "Learn More", link: "https://www.mayoclinic.org/diseases-conditions/pulmonary-edema/symptoms-causes/syc-20377009" }
        ]
      },
      {
        name: "Pneumothorax",
        definition: "A collapsed lung occurs when air leaks into the space between the lung and chest wall.",
        symptoms: ["Sudden chest pain", "Shortness of breath", "Rapid heart rate", "Bluish skin color"],
        treatment: "Treatment depends on severity but may include oxygen, needle aspiration, or chest tube placement.",
        resources: [
          { label: "Learn More", link: "https://www.nhlbi.nih.gov/health-topics/pneumothorax" }
        ]
      },
      {
        name: "Pulmonary Fibrosis",
        definition: "Scarring of the lungs that leads to progressive respiratory difficulty.",
        symptoms: ["Progressive shortness of breath", "Dry cough", "Fatigue", "Unexplained weight loss"],
        treatment: "Treatment includes medications that slow disease progression and pulmonary rehabilitation.",
        resources: [
          { label: "Learn More", link: "https://www.pulmonaryfibrosis.org/" }
        ]
      },
      {
        name: "Pleural Effusion",
        definition: "An abnormal collection of fluid between the layers of the membrane that lines the lungs and chest cavity.",
        symptoms: ["Chest pain", "Shortness of breath", "Dry cough", "Fever"],
        treatment: "Treatment addresses the underlying cause and may include thoracentesis to remove excess fluid.",
        resources: [
          { label: "Learn More", link: "https://www.lung.org/lung-health-diseases/lung-procedures-and-tests/pleural-effusion" }
        ]
      }
    ];

  return (
    <div className="disease-page">
      <div className="floating-shapes">
        {[...Array(8)].map((_, i) => <div key={i} className="shape"></div>)}
      </div>
      
      <Container className="disease-container">
        <Box className="header-section">
          <Typography variant="h2" className="main-title">
            <span className="gradient-text">Pulmonary Conditions</span>
          </Typography>
          <Typography variant="subtitle1" className="subtitle">
            Comprehensive Medical Reference Guide
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {diseases.map((disease, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <GradientCard className="disease-card">
                <CardContent>
                  <Box className="card-header">
                    <div className="disease-icon">
                      {diseaseIcons[index % diseaseIcons.length]}
                    </div>
                    <Typography variant="h5" className="disease-name">
                      {disease.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" className="definition">
                    {disease.definition}
                  </Typography>

                  <Box className="symptoms-section">
                    <Typography variant="subtitle2" className="section-title">
                      Key Symptoms:
                    </Typography>
                    <ul className="symptoms-list">
                      {disease.symptoms.map((symptom, idx) => (
                        <li key={idx} className="symptom-item">
                          <Typography variant="body2">{symptom}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>

                  <Box className="treatment-section">
                    <Typography variant="subtitle2" className="section-title">
                      Clinical Management:
                    </Typography>
                    <Typography variant="body2" className="treatment-text">
                      {disease.treatment}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions className="card-actions">
                  {disease.resources.map((resource, idx) => (
                    <Button
                      key={idx}
                      className="resource-button"
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.label}
                    </Button>
                  ))}
                </CardActions>
              </GradientCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default DiseaseInfoPage;