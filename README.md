# Staple

A modern, production-quality React application demonstrating clean architecture, robust state management, and best practices for scalable web development.

## Prerequisites

- **Node.js v18.x** (see `.nvmrc` for recommended version)
- **npm** (comes with Node.js)
- **Git**
- **GitHub Personal Access Token** (for GitHub API access, see `.env` setup below)

## Tech Stack

- **React 19**
- **Apollo Client 3.6+**
- **Material-UI (MUI) v7**
- **Vite** (replacing Webpack for faster builds and DX)
- **TypeScript**
- **Jest** for testing
- **ESLint + Prettier** for code quality

## Tech Stack Comparison

| Area                | Old Stack                                      | New Stack                                      | Why the Change?                                                                                  |
|---------------------|------------------------------------------------|------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **React**           | 16.10.1                                        | 19                                             | Modern features, better performance, long-term support.                                          |
| **Material-UI**     | v4.12.4                                        | v7                                             | Improved theming, new components, better TypeScript support, and future-proofing.                |
| **Routing**         | react-router-dom v5                             | react-router-dom v6                            | Simpler, more powerful routing API (`Routes`, `useNavigate`), better code splitting.             |
| **Build Tool**      | Webpack                                        | Vite                                           | Much faster dev server, instant HMR, simpler config, better DX.                                  |
| **State/API**       | Apollo Client 3.6.2                            | Apollo Client 3.6+                             | No change in library, but now fully compatible with React 19 and Vite.                           |
| **Testing**         | Jest                                           | Jest                                           | No change.                                                                                       |
| **Lint/Format**     | ESLint + Prettier                              | ESLint + Prettier                              | No change.                                                                                       |
| **Env Vars**        | `.env`, process.env                             | `.env`, import.meta.env (Vite)                 | Vite requires `VITE_` prefix and uses `import.meta.env` for security and compatibility.          |

---

## Upgrade Process: From Old to New Tech Stack

1. **Preparation & Planning**
   - Audited the codebase and reviewed migration guides for all major dependencies.
   - Created a dedicated upgrade branch for safe, incremental changes.

2. **Upgrade Node.js and Tooling**
   - Updated Node.js to v18.x and added `.nvmrc` for consistency.

3. **Migrate Build Tool: Webpack → Vite**
   - Removed all Webpack configs and scripts.
   - Installed and configured Vite, updating scripts in `package.json`.

4. **Upgrade React**
   - Updated `react` and `react-dom` to v19.
   - Ensured `tsconfig.json` and code used the new JSX runtime if needed.

5. **Upgrade Material-UI (MUI)**
   - Upgraded from `@material-ui/core` v4 to `@mui/material` v7.
   - Updated all imports and component usages to match the new API.

6. **Upgrade React Router**
   - Upgraded `react-router-dom` from v5 to v6.
   - Refactored all routing logic to use `Routes` and `useNavigate`.

7. **Update Apollo Client**
   - Ensured Apollo Client 3.6+ compatibility with React 19 and Vite.

8. **Update Environment Variable Handling**
   - Switched to Vite's env system, using the `VITE_` prefix and `import.meta.env`.

9. **Remove Legacy and Unused Files**
   - Deleted old configs and scripts, updated documentation.

10. **Test and Refactor**
    - Ran the app, fixed runtime/type errors, and updated tests.

11. **Document the Migration**
    - Updated the README and in-code comments to reflect the new stack and setup.

12. **Review and Merge**
    - Opened a pull request for review and merged after successful testing.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd github-interactive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root:
     ```
     VITE_GITHUB_TOKEN=your_github_token_here
     ```
   - [How to create a GitHub token](https://github.com/settings/tokens) (requires `repo` and `read:user` scopes).

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   - The app will be available at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is in use).

5. **Build for production:**
   ```bash
   npm run build
   ```
   - The optimized build will be in the `dist` directory.

6. **Run tests:**
   ```bash
   npm test
   ```

## Available Scripts

- `npm run dev` — Starts the Vite development server
- `npm run build` — Builds the app for production
- `npm test` — Runs the test suite
- `npm run lint` — Checks code quality with ESLint
- `npm run format` — Formats code using Prettier

## Project Structure

```
github-interactive/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── App.tsx          # Root component
├── public/              # Static files
├── dist/                # Production build output
├── .env                 # Environment variables (not committed)
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
└── package.json         # Project dependencies and scripts
```

## Architectural Decisions

- **Vite over Webpack:**  
  Vite offers significantly faster development startup and hot module replacement, making the developer experience smoother and more productive.
- **React 19 & MUI v7:**  
  Upgrading to the latest versions ensures long-term support, access to new features, and improved performance.
- **TypeScript:**  
  Enforces type safety and improves maintainability for a growing codebase.
- **Apollo Client:**  
  Provides a robust and flexible way to interact with the GitHub GraphQL API.
- **Environment Variables:**  
  Sensitive data (like GitHub tokens) are managed via `.env` and never committed to version control.

## Challenges Encountered During Tech Stack Upgrade

- **React Router Migration:**  
  Migrating from `react-router-dom` v5 to v6 required updating all routing logic to use the new `Routes` and `useNavigate` APIs.
- **Material-UI Breaking Changes:**  
  MUI v7 introduced changes to component props and theming, requiring updates to component usage and styling.
- **Vite Migration:**  
  Switching from Webpack to Vite involved removing legacy config files, updating scripts, and ensuring all static assets and environment variables were handled correctly.
- **Type Compatibility:**  
  Upgrading dependencies required resolving several TypeScript and type compatibility issues, especially with third-party libraries.
- **Environment Variable Handling:**  
  Ensured that all sensitive tokens are loaded via Vite's `import.meta.env` and documented the process for contributors.

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

## Test Coverage

The project maintains strong test coverage to ensure reliability and maintainability. Latest coverage results:

| File/Directory         | Statements | Branches | Functions | Lines  |
|-----------------------|------------|----------|-----------|--------|
| All files             |   80.55%   |  77.10%  |  77.27%   | 82.73% |
| src/components        |   82.60%   |  76.54%  |  83.87%   | 85.45% |
| src/components/GitHubRepoList.tsx | 96.29% | 93.75% | 87.5% | 96.29% |
| src/components/RepoDetailsModal.tsx | 87.5% | 80% | 100% | 92.1% |
| src/components/CreateRepoForm.tsx | 70.83% | 63.33% | 63.63% | 73.33% |
| src/graphql           |   100%     |  100%    |  100%     | 100%   |
| src/pages             |   66.66%   |  100%    |  50%      | 66.66% |

- **Test Suites:** 5 passed, 0 failed
- **Tests:** 22 passed, 0 failed
- **How to run:**
  ```bash
  npm test -- --coverage
  ```

## Performance Analytics

- **Vite Build & Dev:**
  - Instant dev server startup and fast hot module replacement (HMR)
  - Production builds complete in seconds for medium-sized projects
- **React 19 & MUI v7:**
  - Improved rendering performance and reduced bundle size
  - Optimized component updates and tree-shaking
- **Testing:**
  - Test suite runs in ~4 seconds for 22 tests across 5 suites
  - High coverage ensures minimal regression risk
- **Best Practices:**
  - Efficient GraphQL queries and caching with Apollo Client

For more detailed performance profiling, use browser dev tools and Vite's built-in analyzer plugins.

## License

MIT 

## Extra Enhancements

- **Dark Mode Toggle:** Easily switch between light and dark themes using the toggle in the header for a comfortable viewing experience in any environment.
- **Edit Repository Description:** Inline editing of repository descriptions directly from the repository list for quick updates.
- **UI Improvements:** Enhanced the pull request modal and overall UI for better appearance and usability in both light and dark modes. 