# Contributing to Staple

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages and have specific guidelines for pull requests.

## Commit Message Convention

Each commit message should be structured as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `ci`: Changes to our CI configuration files and scripts

### Scopes

The scope should be the name of the module affected (as perceived by the person reading the changelog). Examples:
- `auth`
- `api`
- `ui`
- `deps`
- `config`

### Description

The description should be in the imperative mood and should not be capitalized. It should not end with a period.

### Examples

```
feat(auth): add login form component
fix(api): handle network errors in user fetch
docs(readme): update installation instructions
style(ui): format button component
refactor(store): simplify state management
perf(api): optimize data fetching
test(auth): add login form tests
chore(deps): update dependencies
ci(github): add automated testing workflow
```

## Pull Request Guidelines

1. **Branch Naming**
   - Feature branches: `feat/description-of-feature`
   - Bug fix branches: `fix/description-of-fix`
   - Documentation branches: `docs/description-of-docs`
   - Other branches follow the same pattern: `type/description`

2. **PR Title**
   - Follow the same convention as commit messages
   - Example: `feat(auth): implement user authentication`

3. **PR Description**
   - Use the PR template (see below)
   - Include a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

4. **PR Template**
   ```markdown
   ## Description
   [Provide a brief description of the changes]

   ## Type of Change
   - [ ] New feature (non-breaking change)
   - [ ] Bug fix (non-breaking change)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update
   - [ ] Code refactoring
   - [ ] Performance improvement
   - [ ] Test addition or update
   - [ ] CI/CD update

   ## Related Issues
   [Link any related issues here]

   ## Checklist
   - [ ] My code follows the style guidelines of this project
   - [ ] I have performed a self-review of my own code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] New and existing unit tests pass locally with my changes
   - [ ] Any dependent changes have been merged and published

   ## Screenshots (if applicable)
   [Add screenshots here if the PR includes UI changes]
   ```

5. **Review Process**
   - All PRs require at least one review
   - All CI checks must pass
   - PRs should be up to date with the main branch
   - Address all review comments before merging

6. **Merging**
   - Use squash and merge for feature branches
   - Use rebase and merge for bug fixes
   - The PR title will be used as the commit message
   - Delete the branch after merging 