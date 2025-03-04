import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import changelogRoutes from './routes/changelog.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', changelogRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'AI Changelog Generator API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 