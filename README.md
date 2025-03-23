# EchoMentor

AI-powered job prep tool built for Techxccelerate 2025 to help users ace interviews and polish applications with a neon-themed UI.

## Key Features

- **Interview Practice**
  - *What*: Mock feedback on speech (filler words, sentiment) and posture.
  - *Where*: `InterviewPage.js` (recording, mock data display).
  - *How*: Uses MicRecorder for audio, mock data for analysis.

- **Resume Analysis**
  - *What*: Extract skills, feedback, and word count from PDF resumes.
  - *Where*: `ResumePage.js` (upload UI), `index.js` (`/api/parse-resume`).
  - *How*: Backend parses PDFs with `pdf-parse`.

- **Job Matching**
  - *What*: Mock gap analysis between resume and job description.
  - *Where*: `JobMatchingPage.js` (input/output), `index.js` (`/api/match-job`).
  - *How*: Backend returns static mock gaps.

- **Cover Letter Generator**
  - *What*: Mock cover letter from resume and job details.
  - *Where*: `CoverLetterPage.js` (UI), `index.js` (`/api/generate-cover-letter`).
  - *How*: Backend crafts a templated letter.

## Tech Stack

- **Frontend**
  - *React*: Dynamic pages (`InterviewPage.js`, `ResumePage.js`, etc.).
  - *Material-UI (MUI)*: Neon-styled components (`Navbar.js`, all pages).
  - *Framer Motion*: Animations (`Navbar.js`, result cards).
  - *React Router*: Navigation (`App.js`).

- **Backend**
  - *Node.js*: Server runtime (`index.js`).
  - *Express*: API endpoints (`index.js`).
  - *Multer*: File uploads (`/api/upload-audio`, `/api/parse-resume`).
  - *pdf-parse*: Resume text extraction (`/api/parse-resume`).


## APIs & Integrations

- **Deepgram** (Speech-to-Text)
  - *Purpose*: Audio transcription (mocked due to issues).
  - *Where*: `index.js` (`/api/analyze-speech`).
  - *Key*: `DEEPGRAM_API_KEY` in `.env`.

- **Hugging Face** (Sentiment Analysis)
  - *Purpose*: Sentiment scoring for transcripts.
  - *Where*: `index.js` (`/api/analyze-speech`).
  - *Key*: `HUGGINGFACE_API_KEY` in `.env`.

- **OpenAI** (Future Use)
  - *Purpose*: Planned for enhanced feedback.
  - *Where*: `index.js` (initialized, unused).
  - *Key*: `OPENAI_API_KEY` in `.env`.
