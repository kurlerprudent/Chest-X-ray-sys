// UploadPage.js
import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactWebcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faCheckCircle, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';
import { usePredictions } from '../context/PredictionContext';
import './UploadPage.css';

const UploadPage = () => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'scan'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const { addPrediction } = usePredictions();

  // Toggle between upload and scan modes.
  const handleModeChange = (event, newValue) => {
    setMode(newValue);
    setUploadedImage(null);
    setFile(null);
    setPrediction(null);
  };

  // Handle image upload via Dropzone.
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setUploadedImage(URL.createObjectURL(selectedFile));
      setPrediction(null);
    }
  };

  // Capture image from webcam.
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("No image captured from webcam.");
      return;
    }
    setUploadedImage(imageSrc);
    setFile(dataURLtoFile(imageSrc, 'scanned_image.png'));
    setPrediction(null);
  };

  // Helper: Convert base64 to a File object.
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

  // Simulate the prediction logic.
  const simulatePrediction = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const diseases = ['Pneumonia', 'Tuberculosis', 'COVID-19'];
        const diseaseDetected = Math.random() > 0.5;
        const diseaseType = diseaseDetected ? diseases[Math.floor(Math.random() * diseases.length)] : null;
        const info = diseaseDetected
          ? `The analysis suggests a possibility of ${diseaseType}. Follow-up tests are advised.`
          : 'No significant abnormalities detected.';
        const confidence = Math.floor(Math.random() * 21) + 80;
        resolve({
          diseaseDetected,
          diseaseType,
          info,
          confidence,
          timestamp: new Date().toISOString(),
          inferenceTime: (Math.random() * 0.5 + 1).toFixed(2) // simulated time between 1 and 1.5 seconds
        });
      }, 1000); // simulate a 1 second delay
    });
  };

  // Trigger the prediction simulation.
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const predictionResult = await simulatePrediction();
      setPrediction(predictionResult);
      addPrediction(predictionResult); // update global prediction history
    } catch (error) {
      console.error("Error during prediction:", error);
      setPrediction({ error: 'Failed to analyze image' });
    }
    setLoading(false);
  };

  // Download report.
  const downloadReport = () => {
    if (!prediction) return;
    const reportContent = `
Chest X-Ray Analysis Report
----------------------------
Prediction Date: ${new Date().toLocaleString()}

Prediction: ${prediction.diseaseDetected ? 'Disease Detected' : 'No Disease Detected - Clean'}
Disease Type: ${prediction.diseaseDetected ? prediction.diseaseType : 'N/A'}
Details: ${prediction.info}
Confidence: ${prediction.confidence}%
    `;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${Date.now()}.txt`;
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

          {/* Mode toggle: Upload vs. Scan */}
          <Tabs value={mode} onChange={handleModeChange} centered>
            <Tab label="Upload" value="upload" />
            <Tab label="Scan" value="scan" />
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
              <Typography variant="h6" className="preview-title">
                Image Preview
              </Typography>
              <div className="image-wrapper">
                <img src={uploadedImage} alt="Preview" className="preview-image" />
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
                <Typography variant="h6" className="result-title">
                  Result:
                </Typography>
                <div className="result-content">
                  {prediction.error ? (
                    <Typography variant="body1" color="error">
                      {prediction.error}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h5">
                        {prediction.diseaseDetected 
                          ? `Disease Detected: ${prediction.diseaseType}` 
                          : "No Disease Detected - Clean"}
                      </Typography>
                      <Typography variant="body1">
                        {prediction.info}
                      </Typography>
                      <Typography variant="body2">
                        Confidence: {prediction.confidence}% | Inference Time: {prediction.inferenceTime}s
                      </Typography>
                    </>
                  )}
                </div>
              </Box>
              <Box mt={2}>
                <Button variant="outlined" color="secondary" onClick={downloadReport}>
                  Download Report
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
