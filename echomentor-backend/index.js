require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@deepgram/sdk');
const { OpenAI } = require('openai');
const axios = require('axios');
const pdf = require('pdf-parse');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ dest: 'uploads/' });
app.use(express.static('uploads'));

console.log('Starting server...');
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/api/question', async (req, res) => {
  const { role } = req.query;
  try {
    if (!role) throw new Error('Role is required');
    const mockQuestion = `Tell me about a time you solved a complex problem as a ${role}.`;
    res.json({ question: mockQuestion });
    console.log('Mock question generated:', mockQuestion);
  } catch (error) {
    console.error('Error in /api/question:', error.message);
    res.status(500).json({ error: `Failed to generate question: ${error.message}` });
  }
});

app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log('Audio uploaded:', filePath);
    const audioBuffer = await fs.readFile(filePath);
    res.json({ filePath });
  } catch (error) {
    console.error('Error uploading audio:', error.message);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

app.post('/api/analyze-speech', async (req, res) => {
  const { filePath } = req.body;
  console.log('Entering /api/analyze-speech with filePath:', filePath);
  try {
    if (!filePath) throw new Error('No file path provided');
    const audioBuffer = await fs.readFile(filePath);
    console.log('Audio buffer length:', audioBuffer.length);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        mimetype: 'audio/mp3',
        model: 'nova',
        punctuate: true,
        utterances: true,
      }
    );
    if (error) throw new Error(`Deepgram error: ${error.message || error}`);

    // Log full response for debugging
    console.log('Full Deepgram response:', JSON.stringify(result, null, 2));

    // Adjust based on Deepgram's response structure (updated for latest SDK)
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    if (!transcript) throw new Error('No transcript generated or invalid response structure');

    console.log('Deepgram transcript:', transcript);

    const fillerCount = (transcript.match(/\b(um|uh|like)\b/gi) || []).length;

    const sentiment = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: transcript },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );
    console.log('Hugging Face sentiment:', sentiment.data);

    res.json({
      transcript,
      fillerCount,
      sentiment: sentiment.data[0].label,
      confidence: sentiment.data[0].score * 100,
    });
  } catch (error) {
    console.error('Error in /api/analyze-speech:', error.message);
    res.status(500).json({ error: `Failed to analyze speech: ${error.message}` });
  }
});

app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No resume file provided');
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log('Received resume file:', filePath);

    const data = await pdf(filePath);
    const resumeText = data.text.toLowerCase();
    console.log('Parsed PDF text (first 100 chars):', resumeText.substring(0, 100));

    const skillsList = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker', 'git', 'html', 'css',
      'typescript', 'mongodb', 'graphql', 'kubernetes', 'ci/cd', 'agile', 'scrum',
    ];
    const detectedSkills = skillsList.filter(skill => resumeText.includes(skill));
    console.log('Detected skills:', detectedSkills);

    let feedback;
    if (detectedSkills.length > 5) {
      feedback = 'Great job! Your resume lists a robust set of skills. Highlight specific projects or achievements to make it even stronger.';
    } else if (detectedSkills.length > 0) {
      feedback = 'Solid skills detected! Consider adding more technical skills or quantifiable results (e.g., "Improved performance by 20%") to enhance it.';
    } else {
      feedback = 'No technical skills detected. Add relevant skills like "JavaScript" or "Python" to improve your resume.';
    }

    res.json({
      skills: detectedSkills.length ? detectedSkills.join(', ') : 'No specific skills detected',
      feedback,
      wordCount: resumeText.split(/\s+/).length,
    });
  } catch (error) {
    console.error('Error in /api/parse-resume:', error.message);
    res.status(500).json({ error: `Failed to parse resume: ${error.message}` });
  }
});

app.post('/api/match-job', async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  try {
    const mockGaps = `The resume is strong but lacks experience in cloud computing mentioned in the job description. Consider adding relevant projects or certifications.`;
    res.json({ gaps: mockGaps });
  } catch (error) {
    console.error('Error in /api/match-job:', error.message);
    res.status(500).json({ error: 'Failed to match job' });
  }
});

app.post('/api/generate-cover-letter', async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  try {
    const mockCoverLetter = `Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position. Based on my resume (${resumeText.substring(0, 50)}...), I bring skills in JavaScript and React that align with your job description (${jobDescription.substring(0, 50)}...). Thank you for considering me!\n\nSincerely,\nRohit Vyas`;
    res.json({ coverLetter: mockCoverLetter });
  } catch (error) {
    console.error('Error in /api/generate-cover-letter:', error.message);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));