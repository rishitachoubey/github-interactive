# Git Workflow and Branching Strategy

## Branch Structure

We follow a Git Flow-inspired branching strategy with the following main branches:

### Main Branches

1. `main`
   - Contains production-ready code
   - Always stable and deployable
   - Protected branch (requires PR reviews)
   - Only accepts merges from `development`
   - Tagged with semantic versioning for releases

2. `development`
   - Main development branch
   - Contains the latest delivered development changes
   - Merges into `main` when stable
   - Protected branch (requires PR reviews)

### Supporting Branches

1. Feature Branches (`feat/*`)
   - Branch from: `development`
   - Merge back into: `development`
   - Naming: `feat/description-of-feature`
   - Example: `feat/user-authentication`

2. Bugfix Branches (`fix/*`)
   - Branch from: `development`
   - Merge back into: `development`
   - Naming: `fix/description-of-fix`
   - Example: `fix/login-validation`

3. Hotfix Branches (`hotfix/*`)
   - Branch from: `main`
   - Merge back into: `main` and `development`
   - Naming: `hotfix/description-of-fix`
   - Example: `hotfix/security-patch`

4. Release Branches (`release/*`)
   - Branch from: `development`
   - Merge back into: `main` and `development`
   - Naming: `release/vX.Y.Z`
   - Example: `release/v1.2.0`

## Workflow Process

### Starting Development

1. Ensure you're on the `development` branch and it's up to date:
   ```bash
   git checkout development
   git pull origin development
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

### During Development

1. Make regular, focused commits following the Conventional Commits specification
2. Keep your branch up to date with development:
   ```bash
   git checkout development
   git pull origin development
   git checkout feat/your-feature-name
   git rebase development
   ```

### Completing a Feature

1. Ensure all tests pass and code meets quality standards
2. Update your branch with the latest development:
   ```bash
   git checkout development
   git pull origin development
   git checkout feat/your-feature-name
   git rebase development
   ```

3. Create a Pull Request to `development`
   - Use the PR template
   - Ensure CI passes
   - Get required reviews
   - Address review comments

4. After approval, merge using:
   - Squash and merge for feature branches
   - Rebase and merge for bugfixes
   - Create merge commit for hotfixes

### Release Process

1. Create a release branch from `development`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b release/vX.Y.Z
   ```

2. Make any release-specific changes (version bumps, etc.)
3. Create PR to `main`
4. After approval and merge:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
5. Merge release branch back to `development`

### Hotfix Process

1. Create hotfix branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/issue-description
   ```

2. Make necessary fixes
3. Create PRs to both `main` and `development`
4. After approval:
   - Merge to `main` and tag the release
   - Merge to `development`

## Commit Strategy

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks
- `ci`: CI configuration changes

### Commit Guidelines

1. Each commit should be focused and atomic
2. Write clear, descriptive commit messages
3. Use the imperative mood in commit messages
4. Reference issues when applicable
5. Keep commits small and focused

## Branch Protection Rules

### Main Branch
- Requires pull request reviews
- Requires status checks to pass
- Requires branches to be up to date
- No direct pushes allowed

### Development Branch
- Requires pull request reviews
- Requires status checks to pass
- Requires branches to be up to date
- No direct pushes allowed

## Versioning

We follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- MAJOR: Incompatible API changes
- MINOR: Backwards-compatible functionality
- PATCH: Backwards-compatible bug fixes

Each release to `main` should be tagged with the appropriate version number. 