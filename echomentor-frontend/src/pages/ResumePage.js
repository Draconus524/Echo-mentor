import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Description } from '@mui/icons-material';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const resultVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function ResumePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setResumeResult(null); // Reset previous results
    } else {
      setResumeResult({ error: 'Please upload a valid PDF file.' });
    }
  };

  const analyzeResume = async () => {
    if (!resumeFile) {
      setResumeResult({ error: 'Please upload a resume first.' });
      return;
    }
    try {
      setLoading(true);
      console.log('Uploading resume...');
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await axios.post('http://localhost:4000/api/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Resume analysis response:', res.data);
      setResumeResult(res.data);
    } catch (error) {
      console.error('Error analyzing resume:', error.response?.data || error.message);
      setResumeResult({ error: error.response?.data?.error || 'Failed to analyze resume' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
        pt: '80px', // Space for navbar
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <Card sx={{ maxWidth: 900, width: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#00e5ff' }}>
                Resume Analysis
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#b0bec5', mb: 1 }}>
                    Upload Resume (PDF):
                  </Typography>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    style={{ color: '#ffffff' }}
                  />
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={analyzeResume}
                      disabled={!resumeFile || loading}
                      sx={{ mt: 2 }}
                      startIcon={<Description />}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analyze Resume'}
                    </Button>
                  </motion.div>
                </Grid>
                {resumeResult && (
                  <Grid item xs={12}>
                    <motion.div initial="hidden" animate="visible" variants={resultVariants}>
                      <Box
                        sx={{
                          mt: 3,
                          p: 3,
                          backgroundColor: '#2d2d2d',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.1)',
                        }}
                      >
                        <Typography variant="h6" sx={{ color: '#00e5ff', mb: 2 }}>
                          Resume Results
                        </Typography>
                        {resumeResult.error ? (
                          <Typography color="error">{resumeResult.error}</Typography>
                        ) : (
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Description sx={{ color: '#00e5ff' }} />
                              </ListItemIcon>
                              <ListItemText primary={`Skills: ${resumeResult.skills}`} />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Description sx={{ color: '#00e5ff' }} />
                              </ListItemIcon>
                              <ListItemText primary={`Feedback: ${resumeResult.feedback}`} />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Description sx={{ color: '#00e5ff' }} />
                              </ListItemIcon>
                              <ListItemText primary={`Word Count: ${resumeResult.wordCount}`} />
                            </ListItem>
                          </List>
                        )}
                      </Box>
                    </motion.div>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}

export default ResumePage;