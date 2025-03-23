import React, { useState, useRef } from 'react';
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
import Webcam from 'react-webcam';
import MicRecorder from 'mic-recorder-to-mp3';
import { motion } from 'framer-motion';
import {
  Mic,
  Stop,
  SentimentSatisfied,
  Straighten,
  VolumeUp,
  Description,
} from '@mui/icons-material';

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

function InterviewPage() {
  const [role, setRole] = useState('');
  const [question, setQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const recorder = useRef(new MicRecorder({ bitRate: 128 }));

  const getQuestion = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/question?role=${role}`);
      setQuestion(res.data.question);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      await recorder.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.current.stop().getMp3();
      setIsRecording(false);
      setAudioBlob(blob);
      console.log('Recording stopped, blob size:', blob.size);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const analyzeSpeech = async () => {
    if (!audioBlob) {
      setFeedback({ error: 'Please record audio first.' });
      return;
    }
    try {
      setLoading(true);
      console.log('Simulating speech analysis...');
      // Mock speech analysis data
      const mockFeedback = {
        transcript: 'Um, I built a cool app with React and, uh, deployed it to AWS.',
        fillerCount: 2,
        sentiment: 'POSITIVE',
        confidence: 87.5,
      };
      setTranscript(mockFeedback.transcript);
      setFeedback(mockFeedback);
    } catch (error) {
      console.error('Error simulating speech analysis:', error.message);
      setFeedback({ error: 'Failed to simulate speech analysis' });
    } finally {
      setLoading(false);
    }
  };

  const analyzeBodyLanguage = () => {
    console.log('Simulating posture analysis...');
    const mockPostureFeedback = "Your posture looks confident! Keep your shoulders back and maintain eye contact.";
    setFeedback((prev) => ({
      ...prev,
      posture: mockPostureFeedback,
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
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
                Interview Practice & Resume Analysis
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Job Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                      input: { color: '#ffffff' },
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
                      color="primary"
                      onClick={getQuestion}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? <CircularProgress size={24} /> : 'Get Question'}
                    </Button>
                  </motion.div>
                </Grid>
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
                      sx={{ mt: 1 }}
                      startIcon={<Description />}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analyze Resume'}
                    </Button>
                  </motion.div>
                </Grid>
                {question && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ mt: 2, p: 2, backgroundColor: '#2d2d2d', borderRadius: '8px' }}
                      >
                        {question}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Webcam audio={false} ref={webcamRef} width="100%" style={{ borderRadius: '8px' }} />
                    </Grid>
                    <Grid item xs={12} container spacing={2} justifyContent="center">
                      <Grid item>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={startRecording}
                            disabled={isRecording || loading}
                            startIcon={<Mic />}
                          >
                            Start Recording
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={stopRecording}
                            disabled={!isRecording}
                            startIcon={<Stop />}
                          >
                            Stop Recording
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={analyzeSpeech}
                            disabled={!audioBlob || loading}
                            startIcon={<VolumeUp />}
                          >
                            {loading ? <CircularProgress size={24} /> : 'Analyze Speech'}
                          </Button>
                        </motion.div>
                      </Grid>
                      <Grid item>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={analyzeBodyLanguage}
                            disabled={loading}
                            startIcon={<Straighten />}
                          >
                            Analyze Posture
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </>
                )}
                {(transcript || feedback || resumeResult) && (
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
                          Results
                        </Typography>
                        {feedback && (
                          <>
                            <Typography variant="subtitle1" sx={{ color: '#ff4081', mb: 1 }}>
                              Interview Feedback
                            </Typography>
                            {feedback.error ? (
                              <Typography color="error">{feedback.error}</Typography>
                            ) : (
                              <List>
                                {transcript && (
                                  <ListItem>
                                    <ListItemIcon>
                                      <VolumeUp sx={{ color: '#00e5ff' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={`Transcript: ${transcript}`} />
                                  </ListItem>
                                )}
                                {feedback.fillerCount !== undefined && (
                                  <ListItem>
                                    <ListItemIcon>
                                      <Mic sx={{ color: '#00e5ff' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={`Filler Words: ${feedback.fillerCount}`} />
                                  </ListItem>
                                )}
                                {feedback.sentiment && (
                                  <ListItem>
                                    <ListItemIcon>
                                      <SentimentSatisfied sx={{ color: '#00e5ff' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`Sentiment: ${feedback.sentiment} (${feedback.confidence}%)`}
                                    />
                                  </ListItem>
                                )}
                                {feedback.posture && (
                                  <ListItem>
                                    <ListItemIcon>
                                      <Straighten sx={{ color: '#00e5ff' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={`Posture: ${feedback.posture}`} />
                                  </ListItem>
                                )}
                              </List>
                            )}
                          </>
                        )}
                        {resumeResult && (
                          <>
                            <Typography variant="subtitle1" sx={{ color: '#ff4081', mb: 1, mt: feedback ? 2 : 0 }}>
                              Resume Analysis
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
                          </>
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

export default InterviewPage;