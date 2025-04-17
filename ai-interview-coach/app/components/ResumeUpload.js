// app/components/ResumeUpload.js
'use client';  // This marks this file as a client component in Next.js.

import { useState } from 'react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Parsed PDF text:', data.text); // Handle parsed text here
      } else {
        const errorData = await response.json();
        console.error('Error uploading PDF:', errorData.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ResumeUpload;
