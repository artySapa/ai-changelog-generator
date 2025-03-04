import express from 'express';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

// Verify the environment variables are loaded
console.log('Deepseek Key exists:', !!process.env.DEEPSEEK_API_KEY);
console.log('GitHub Token exists:', !!process.env.GITHUB_TOKEN);

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

async function generateChangelogWithDeepseek(commitMessages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates clear and concise changelogs from git commits. Group similar changes together and format the output in markdown."
        },
        {
          role: "user",
          content: `Generate a user-friendly changelog from these commits:\n${commitMessages}`
        }
      ],
      temperature: 0.7
    });

    console.log('Deepseek API Response:', completion); // Debug log
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateChangelogWithDeepseek:', error);
    throw error;
  }
}

router.post('/changelog', async (req, res) => {
  try {
    const { repoUrl, days } = req.body;
    
    // Extract owner and repo from URL
    const urlParts = repoUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/');
    
    if (urlParts.length < 2) {
      throw new Error('Invalid GitHub repository URL format');
    }
    
    const [owner, repo] = urlParts;
    
    console.log('Fetching commits for:', { owner, repo, days }); // Debug log
    
    // Calculate date range
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    
    // Fetch commits
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      since: since.toISOString(),
    });
    
    console.log(`Found ${commits.length} commits`); // Debug log
    
    if (commits.length === 0) {
      return res.json({
        changelog: "No commits found in the specified time range.",
        commits: 0
      });
    }
    
    // Generate changelog using Deepseek
    const commitMessages = commits.map(commit => commit.commit.message).join('\n');
    const changelog = await generateChangelogWithDeepseek(commitMessages);
    
    res.json({ 
      changelog,
      commits: commits.length
    });
    
  } catch (error) {
    console.error('Error generating changelog:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate changelog',
      details: error.response?.data || {} // Include GitHub API error details if available
    });
  }
});

export default router; 