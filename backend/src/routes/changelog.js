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

async function generateChangelogWithDeepseek(commitMessages, commits) {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a changelog generator that analyzes commits and groups them by the features or components they modify. Format the output as markdown with these categories:

# 🚀 Features
# 🐛 Bug Fixes
# 🔧 Maintenance
# 📚 Documentation

For each feature/component change:
- Group all commits that touch the same feature or component
- Start with "- [Component/Feature Name]:" followed by a high-level summary
- List all specific changes made to this feature/component
- Include technical implementation details
- Show all related commits that contributed to this change

Example format:
# 🚀 Features
- Authentication System:
  - Complete overhaul of the login flow
  - Added JWT token handling in the frontend
  - Implemented secure session management
  - Added remember me functionality
  Related commits:
  > feat(auth): implement new JWT token handling
  > feat(auth): add remember me checkbox
  > refactor(auth): improve session management

# 🐛 Bug Fixes
- User Dashboard:
  - Fixed data loading issues in the activity feed
  - Resolved user preferences not being saved
  - Fixed real-time updates not working
  Related commits:
  > fix(dashboard): resolve activity feed loading
  > fix(dashboard): fix preference saving
  > fix(dashboard): handle real-time updates

Group commits by what part of the system they modify, not just by type.`
        },
        {
          role: "user",
          content: `Analyze these commits and group them by the features/components they modify. Here are the commit details:\n${
            commits.map(commit => ({
              message: commit.commit.message,
              files: commit.files?.map(f => f.filename) || [],
              author: commit.commit.author.name,
              date: commit.commit.author.date,
              sha: commit.sha.substring(0, 7)
            })).map(JSON.stringify).join('\n')
          }`
        }
      ],
      temperature: 0.7
    });

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

    // Fetch all commits with pagination
    let allCommits = [];
    let page = 1;
    const per_page = 100; // Max allowed by GitHub API

    while (true) {
      console.log(`Fetching page ${page} of commits...`);
      
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        since: since.toISOString(),
        per_page,
        page,
      });

      allCommits = allCommits.concat(commits);
      
      // If we got less than per_page commits, we've reached the end
      if (commits.length < per_page) {
        break;
      }
      
      page++;
    }
    
    console.log(`Found ${allCommits.length} total commits`); // Debug log
    
    if (allCommits.length === 0) {
      return res.json({
        changelog: "No commits found in the specified time range.",
        commits: 0
      });
    }
    
    // Generate changelog using Deepseek
    const commitMessages = allCommits.map(commit => commit.commit.message).join('\n');
    const changelog = await generateChangelogWithDeepseek(commitMessages, allCommits);
    
    res.json({ 
      changelog,
      commits: allCommits.length
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