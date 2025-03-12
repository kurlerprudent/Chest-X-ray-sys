// Example usage in a component
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/predict', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
