# AI Changelog Generator

An intelligent changelog generator that analyzes Git commits and creates organized, readable changelogs grouped by features and components. The application uses AI to understand commit messages and group related changes together.

Developers can call the functions in the backend to get JSON view of the AI-generated backlogs. 

https://github.com/user-attachments/assets/24fba8fe-d3ba-4711-b84e-304f314fcc60

This video shows the demo of what the project looks like after following all of the steps in the "Setup and Installation" part.

## Features

- 🤖 AI-powered commit analysis and grouping
- 🔍 Smart categorization of changes (Features, Bug Fixes, Maintenance, Documentation)
- 📊 Feature-focused organization of changes
- 🎨 Modern, responsive UI with animated loading states
- ⚡ Real-time filtering by change categories
- 📅 Flexible date range selection
- 🔄 Pagination support for large repositories

## Tech Stack

### Frontend
- **React** with Vite for fast development and building
- **Tailwind CSS** for utility-first styling
- **Styled Components** for component-specific animations
- **React Markdown** for rendering formatted changelogs

### Backend
- **Node.js** with Express for the API server
- **Octokit** for GitHub API integration
- **Deepseek AI** for intelligent commit analysis
- **dotenv** for environment configuration

## Technical Decisions

1. **Architecture**
   - Separated frontend and backend for better scalability
   - RESTful API design for clear client-server communication
   - Component-based architecture in React for reusability

2. **Styling Approach**
   - Combined Tailwind CSS with Styled Components
   - Tailwind for rapid UI development and consistency
   - Styled Components for complex animations and dynamic styles

3. **State Management**
   - Used React's built-in useState for local state
   - Prop drilling minimized through component composition
   - Loading states managed at form level for better UX

4. **API Integration**
   - Implemented pagination for GitHub API calls
   - Error handling with informative user feedback
   - Rate limiting consideration in API calls

5. **Performance**
   - Memoization of expensive computations
   - Optimized re-renders using proper React patterns
   - Efficient handling of large commit histories

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with:
   GITHUB_TOKEN=your_github_token
   DEEPSEEK_API_KEY=your_deepseek_api_key
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   The backend requires two environment variables:
   - `GITHUB_TOKEN`: GitHub Personal Access Token
   - `DEEPSEEK_API_KEY`: Deepseek AI API Key

## Usage

1. Enter a GitHub repository URL
2. Select the time range for commits
3. Click "Generate Changelog"
4. View the organized changelog with:
   - Feature groupings
   - Related commits
   - Technical details
   - Category filtering

## Development Workflow

1. **Running in Development**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Building for Production**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd frontend
   npm run build
   ```

## Code Organization
```
frontend/
├── src/
│   ├── components/
│   │   ├── ChangelogDisplay.jsx # Displays formatted changelog
│   │   ├── ChangelogForm.jsx # Input form component
│   │   ├── LoadingSpinner.jsx # Loading state component
│   │   └── Loader.jsx # Animated loader
│   ├── App.jsx # Main application component
│   └── index.css # Global styles

backend/
├── src/
│   ├── routes/
│   │   └── changelog.js # Changelog generation endpoint
│   └── index.js # Server setup
```

## Future Improvements

- Add support for multiple repository analysis
- Implement commit diff viewing
- Add more detailed technical change analysis
- Support for more Git hosting platforms
- Add user authentication and saved preferences
- Implement webhook support for automatic changelog generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.
