import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
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

function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [coverLetterResult, setCoverLetterResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCoverLetter = async () => {
    try {
      setLoading(true);
      console.log('Generating cover letter...');
      // Mock data if fields are empty
      const jobDesc = jobDescription || 'Software Engineer role requiring JavaScript, React, and AWS experience.';
      const resume = resumeText || 'Experienced in JavaScript and React, built a web app.';
      
      const res = await axios.post('http://localhost:4000/api/generate-cover-letter', {
        resumeText: resume,
        jobDescription: jobDesc,
      });
      console.log('Cover letter response:', res.data);
      setCoverLetterResult(res.data);
    } catch (error) {
      console.error('Error generating cover letter:', error.response?.data || error.message);
      setCoverLetterResult({ error: error.response?.data?.error || 'Failed to generate cover letter' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
        pt: '80px',
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
                Cover Letter Generator
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Job Description (optional)"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Enter job description or leave blank for mock data"
                    sx={{
                      input: { color: '#ffffff' },
                      textarea: { color: '#ffffff' },
                      label: { color: '#b0bec5' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#00e5ff' },
                        '&:hover fieldset': { borderColor: '#ff4081' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Resume Text (optional)"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Enter resume text or leave blank for mock data"
                    sx={{
                      input: { color: '#ffffff' },
                      textarea: { color: '#ffffff' },
                      label: { color: '#b0bec5' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#00e5ff' },
                        '&:hover fieldset': { borderColor: '#ff4081' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={generateCoverLetter}
                      disabled={loading}
                      fullWidth
                      startIcon={<Description />}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Generate Cover Letter'}
                    </Button>
                  </motion.div>
                </Grid>
                {coverLetterResult && (
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
                          Cover Letter
                        </Typography>
                        {coverLetterResult.error ? (
                          <Typography color="error">{coverLetterResult.error}</Typography>
                        ) : (
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Description sx={{ color: '#00e5ff' }} />
                              </ListItemIcon>
                              <ListItemText primary={coverLetterResult.coverLetter} primaryTypographyProps={{ whiteSpace: 'pre-wrap' }} />
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

export default CoverLetterPage;