# Staple

A production-quality React application demonstrating clean architecture, proper Git practices, and technical excellence.

## Prerequisites

- Node.js v16.x
- npm (comes with Node.js)
- Git

## Tech Stack

- React 16.10.1
- Apollo Client 3.6.2
- Material-UI 4.12.4
- TypeScript
- Webpack
- Jest for testing
- ESLint + Prettier for code quality

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd staple
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   This will start the application in development mode at [http://localhost:8080](http://localhost:8080).

4. Build for production:
   ```bash
   npm run build
   ```
   This will create an optimized production build in the `dist` directory.

## Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Creates a production build
- `npm test` - Runs the test suite
- `npm run lint` - Runs ESLint to check code quality
- `npm run format` - Formats code using Prettier

## Project Structure

```
staple/
├── src/                    # Source files
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles
│   └── App.tsx           # Root component
├── public/               # Static files
├── tests/               # Test files
├── webpack.config.js    # Webpack configuration
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
└── package.json         # Project dependencies and scripts
```

## Development Guidelines

1. **Code Style**
   - Follow the ESLint and Prettier configurations
   - Write meaningful commit messages
   - Keep components small and focused

2. **Git Workflow**
   - Create feature branches from `main`
   - Write descriptive commit messages
   - Submit pull requests for review

3. **Testing**
   - Write tests for new features
   - Maintain good test coverage
   - Run tests before submitting PRs

## License

MIT 