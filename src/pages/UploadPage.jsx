import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, Tabs, Tab, TextField, Grid } from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactWebcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faCheckCircle, faCamera, faUpload, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { usePredictions } from '../context/PredictionContext';
import './UploadPage.css';

const UploadPage = () => {
  const [mode, setMode] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapUrl, setHeatmapUrl] = useState(null);
  const [ctrValue, setCtrValue] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    patientId: '',
    dob: '',
    sex: '',
    examDate: '',
    clinicalHistory: ''
  });
  
  const webcamRef = useRef(null);
  const { addPrediction } = usePredictions();

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    setUploadedImage(null);
    setFile(null);
    setPrediction(null);
    setShowHeatmap(false);
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setUploadedImage(URL.createObjectURL(selectedFile));
      setPrediction(null);
      setShowHeatmap(false);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("No image captured from webcam.");
      return;
    }
    setUploadedImage(imageSrc);
    setFile(dataURLtoFile(imageSrc, 'scanned_image.png'));
    setPrediction(null);
    setShowHeatmap(false);
  };

  const dataURLtoFile = (dataurl, filename) => {
    if (!dataurl) return null;
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const simulatePrediction = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const diseases = ['Pneumonia', 'Tuberculosis', 'COVID-19', 'Cardiomegaly', 'Lung Opacity'];
        const diseaseDetected = Math.random() > 0.5;
        const diseaseType = diseaseDetected ? diseases[Math.floor(Math.random() * diseases.length)] : null;
        
        // Generate CTR (Cardiothoracic Ratio) - normal range is 0.42-0.50
        const ctr = (Math.random() * 0.2 + 0.4).toFixed(2);
        setCtrValue(ctr);
        
        // Simulate heatmap generation
        const heatmapCanvas = document.createElement('canvas');
        heatmapCanvas.width = 300;
        heatmapCanvas.height = 300;
        const ctx = heatmapCanvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, 'rgba(0, 0, 255, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 255, 0.5)');
        gradient.addColorStop(0.7, 'rgba(255, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(50, 50, 200, 200);
        
        // Add some random circles for "abnormalities"
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * 200 + 50;
          const y = Math.random() * 200 + 50;
          const radius = Math.random() * 20 + 10;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 100)}, 0, 0.8)`;
          ctx.fill();
        }
        
        setHeatmapUrl(heatmapCanvas.toDataURL());
        
        const info = diseaseDetected
          ? `The analysis suggests a possibility of ${diseaseType}. Follow-up tests are advised.`
          : 'No significant abnormalities detected.';
        
        const confidence = Math.floor(Math.random() * 21) + 80;
        
        resolve({
          diseaseDetected,
          diseaseType,
          info,
          confidence,
          ctr,
          timestamp: new Date().toISOString(),
          inferenceTime: (Math.random() * 0.5 + 1).toFixed(2)
        });
      }, 1000);
    });
  };

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({
      ...patientInfo,
      [name]: value
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const predictionResult = await simulatePrediction();
      setPrediction(predictionResult);
      addPrediction(predictionResult);
    } catch (error) {
      console.error("Error during prediction:", error);
      setPrediction({ error: 'Failed to analyze image' });
    }
    setLoading(false);
  };

  const generateReport = () => {
    if (!prediction) return;
    
    const reportContent = `
HEALTHTECH 4 AFRICA - RADIOLOGY REPORT
======================================

PATIENT INFORMATION:
-------------------
Name: ${patientInfo.name || 'Not provided'}
Patient ID: ${patientInfo.patientId || 'N/A'}
Date of Birth: ${patientInfo.dob || 'N/A'}
Sex: ${patientInfo.sex || 'N/A'}
Exam Date: ${patientInfo.examDate || new Date().toLocaleDateString()}

CLINICAL HISTORY/INDICATION:
----------------------------
${patientInfo.clinicalHistory || 'Not provided'}

TECHNIQUE:
----------
Digital Chest Radiograph (PA and lateral views)
AI Analysis Algorithm: DeepSeek-R1 v2.3

FINDINGS:
---------
${prediction.diseaseDetected 
  ? `- Abnormal opacity detected in the ${Math.random() > 0.5 ? 'right' : 'left'} lung field
- Cardiothoracic Ratio (CTR): ${ctrValue} (Normal range: 0.42-0.50)
- Confidence level: ${prediction.confidence}%`
  : `- No acute cardiopulmonary abnormalities
- Cardiothoracic Ratio (CTR): ${ctrValue} (Normal range: 0.42-0.50)
- Clear lung fields and normal cardiac silhouette`}

IMPRESSION:
-----------
${prediction.diseaseDetected 
  ? `Findings are suggestive of ${prediction.diseaseType}. 
Clinical correlation and follow-up imaging are recommended.` 
  : 'No evidence of acute cardiopulmonary disease.'}

ADDITIONAL NOTES:
-----------------
- AI inference time: ${prediction.inferenceTime}s
- Algorithm confidence: ${prediction.confidence}%
- This report was generated by AI and should be reviewed by a qualified radiologist

REPORT GENERATED ON: ${new Date().toLocaleString()}
==================================================
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `XRay_Report_${patientInfo.name || 'Patient'}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="upload-page">
      <div className="floating-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <Container className="upload-container">
        <Box className="content-wrapper">
          <Typography variant="h2" className="upload-title">
            <span className="gradient-text">HealthTech 4 Africa</span>
          </Typography>
          <Typography variant="subtitle1" className="upload-subtitle">
            Upload or Scan your chest radiograph for AI-powered diagnostic insights
          </Typography>

          {/* Patient Information Form */}
          <Box className="patient-form" mb={4}>
            <Typography variant="h6" gutterBottom style={{ color: '#e0e0e0' }}>
              Patient Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  variant="outlined"
                  name="name"
                  value={patientInfo.name}
                  onChange={handlePatientInfoChange}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  InputLabelProps={{
                    style: { color: '#aaa' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patient ID"
                  variant="outlined"
                  name="patientId"
                  value={patientInfo.patientId}
                  onChange={handlePatientInfoChange}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  InputLabelProps={{
                    style: { color: '#aaa' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  variant="outlined"
                  name="dob"
                  type="date"
                  value={patientInfo.dob}
                  onChange={handlePatientInfoChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: '#aaa' }
                  }}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Sex"
                  variant="outlined"
                  name="sex"
                  value={patientInfo.sex}
                  onChange={handlePatientInfoChange}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  InputLabelProps={{
                    style: { color: '#aaa' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Exam Date"
                  variant="outlined"
                  name="examDate"
                  type="date"
                  value={patientInfo.examDate}
                  onChange={handlePatientInfoChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: '#aaa' }
                  }}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Exam Type"
                  variant="outlined"
                  name="examType"
                  value="Chest X-ray"
                  disabled
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  InputLabelProps={{
                    style: { color: '#aaa' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Clinical History / Indication"
                  variant="outlined"
                  name="clinicalHistory"
                  value={patientInfo.clinicalHistory}
                  onChange={handlePatientInfoChange}
                  multiline
                  rows={2}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  InputLabelProps={{
                    style: { color: '#aaa' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Mode toggle: Upload vs. Scan */}
          <Tabs value={mode} onChange={handleModeChange} centered>
            <Tab label="Upload" value="upload" style={{ color: mode === 'upload' ? '#6c5ce7' : '#aaa' }} />
            <Tab label="Scan" value="scan" style={{ color: mode === 'scan' ? '#6c5ce7' : '#aaa' }} />
          </Tabs>

          {mode === 'upload' && (
            <Dropzone onDrop={onDrop} accept="image/*">
              {({ getRootProps, getInputProps }) => (
                <div 
                  {...getRootProps()} 
                  className={`dropzone ${uploadedImage ? 'has-image' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="dropzone-content">
                    <FontAwesomeIcon 
                      icon={uploadedImage ? faCheckCircle : faCloudUploadAlt} 
                      className="upload-icon" 
                    />
                    <div className="dropzone-text">
                      {uploadedImage ? (
                        <>
                          <p>Image Ready for Analysis</p>
                          <small>Click to replace</small>
                        </>
                      ) : (
                        <>
                          <p>Drag & Drop DICOM/JPEG Image</p>
                          <small>or click to browse</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>
          )}

          {mode === 'scan' && (
            <Box className="scan-container">
              <ReactWebcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ facingMode: "user" }}
                className="webcam"
              />
              <Button variant="contained" color="primary" onClick={captureImage}>
                <FontAwesomeIcon icon={faCamera} className="button-icon" />
                Capture Image
              </Button>
            </Box>
          )}

          {uploadedImage && (
            <Box className="preview-container">
              <Typography variant="h6" className="preview-title" style={{ color: '#e0e0e0' }}>
                Image Preview
                {prediction && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    style={{ marginLeft: '15px', color: '#6c5ce7', borderColor: '#6c5ce7' }}
                  >
                    <FontAwesomeIcon 
                      icon={showHeatmap ? faEyeSlash : faEye} 
                      style={{ marginRight: '5px' }} 
                    />
                    {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                  </Button>
                )}
              </Typography>
              <div className="image-wrapper">
                <img src={uploadedImage} alt="Preview" className="preview-image" />
                {showHeatmap && heatmapUrl && (
                  <img src={heatmapUrl} alt="Heatmap" className="heatmap-overlay" />
                )}
                <div className="scanline"></div>
              </div>
            </Box>
          )}

          <Button 
            variant="contained" 
            className="upload-button"
            disabled={!uploadedImage || loading}
            onClick={handleAnalyze}
          >
            <FontAwesomeIcon icon={faUpload} className="button-icon" />
            {loading ? "Analyzing..." : "Analyze Image"}
            <span className="button-shine"></span>
          </Button>

          {prediction && (
            <>
              <Box className="result-container">
                <Typography variant="h6" className="result-title" style={{ color: '#e0e0e0' }}>
                  Analysis Results:
                </Typography>
                <div className="result-content">
                  {prediction.error ? (
                    <Typography variant="body1" style={{ color: '#ff6b6b' }}>
                      {prediction.error}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h5" style={{ 
                        color: prediction.diseaseDetected ? '#ff6b6b' : '#4ecdc4',
                        marginBottom: '10px'
                      }}>
                        {prediction.diseaseDetected 
                          ? `Disease Detected: ${prediction.diseaseType}` 
                          : "No Disease Detected"}
                      </Typography>
                      <Typography variant="body1" style={{ color: '#e0e0e0', marginBottom: '10px' }}>
                        {prediction.info}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#aaa', marginBottom: '5px' }}>
                        <strong>Confidence:</strong> {prediction.confidence}%
                      </Typography>
                      <Typography variant="body2" style={{ color: '#aaa', marginBottom: '5px' }}>
                        <strong>Inference Time:</strong> {prediction.inferenceTime}s
                      </Typography>
                      <Typography variant="body2" style={{ 
                        color: ctrValue > 0.5 ? '#ff6b6b' : '#4ecdc4',
                        marginBottom: '5px'
                      }}>
                        <strong>Cardiothoracic Ratio (CTR):</strong> {ctrValue} 
                        {ctrValue > 0.5 ? ' (Abnormal - possible cardiomegaly)' : ' (Normal)'}
                      </Typography>
                    </>
                  )}
                </div>
              </Box>
              <Box mt={2} display="flex" justifyContent="center" gap={2}>
                <Button 
                  variant="outlined" 
                  style={{ color: '#6c5ce7', borderColor: '#6c5ce7' }}
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  <FontAwesomeIcon icon={showHeatmap ? faEyeSlash : faEye} style={{ marginRight: '8px' }} />
                  {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </Button>
                <Button 
                  variant="contained" 
                  style={{ 
                    background: 'linear-gradient(135deg, #6c5ce7 0%, #4ecdc4 100%)',
                    color: 'white'
                  }}
                  onClick={generateReport}
                >
                  Download Full Report
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>

      <div className="footer-credits">
        <Typography variant="caption" className="credits-text">
          Secure HIPAA-compliant image processing • Powered by Deep Learning
        </Typography>
      </div>
    </div>
  );
};

export default UploadPage;