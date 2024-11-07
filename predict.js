import { pipeline } from '@xenova/transformers';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize the classifier outside the route handler
let classifier;
(async () => {
    try {
        classifier = await pipeline('sentiment-analysis');
    } catch (error) {
        console.error('Error initializing classifier:', error);
    }
})();

// API endpoint for sentiment analysis
app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = await classifier(text);
        res.json({
            text,
            sentiment: result[0].label,
            score: result[0].score
        });
    } catch (error) {
        res.status(500).json({ error: 'Error processing request' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});