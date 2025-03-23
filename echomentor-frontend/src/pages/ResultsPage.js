import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

function ResultsPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Results</Typography>
        <Typography variant="body1">Your feedback and scores will appear here after completing the interview.</Typography>
      </CardContent>
    </Card>
  );
}

export default ResultsPage;