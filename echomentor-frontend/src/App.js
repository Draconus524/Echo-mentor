import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InterviewPage from './pages/InterviewPage';
import ResumePage from './pages/ResumePage';
import JobMatchingPage from './pages/JobMatchingPage';
import CoverLetterPage from './pages/CoverLetterPage';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<InterviewPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/job-matching" element={<JobMatchingPage />} />
        <Route path="/cover-letter" element={<CoverLetterPage />} />
        
      </Routes>
      
    </>
    
  );
}

export default App;