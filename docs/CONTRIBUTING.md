# 🤝 Contributing Guide

## Getting Started

### Development Setup

1. **Fork and clone:**
```bash
git clone https://github.com/your-username/conversor-universal-python.git
cd conversor-universal-python
```

2. **Create virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or .venv\Scripts\activate  # Windows
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

4. **Run tests:**
```bash
pytest
```

### Project Structure

```
conversor-universal-python/
├── backend/               # Backend Flask application
│   ├── api/              # API routes and endpoints
│   ├── core/             # Business logic
│   ├── models/           # Data models
│   └── tests/            # Backend tests
├── src/                  # Frontend Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities
├── docs/                 # Documentation
├── docker/               # Docker configurations
└── scripts/              # Automation scripts
```

## Development Guidelines

### Code Style

**Python (Backend):**
- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters
- Use Black for formatting
- Use isort for imports

```bash
# Format code
black backend/
isort backend/

# Check style
flake8 backend/
mypy backend/
```

**TypeScript (Frontend):**
- Use TypeScript strict mode
- Follow Prettier configuration
- Use ESLint rules
- Prefer functional components with hooks

```bash
# Format and lint
npm run lint
npm run format
```

### Commit Convention

Use [Conventional Commits](https://conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(api): add batch conversion endpoint
fix(converter): handle corrupted PDF files
docs(readme): update installation instructions
test(security): add file validation tests
```

### Testing

**Backend Tests:**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=backend --cov-report=html

# Run specific test file
pytest backend/tests/test_converter.py

# Run with verbose output
pytest -v
```

**Frontend Tests:**
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Test Requirements

- **Unit tests**: All new functions must have tests
- **Integration tests**: API endpoints must have integration tests
- **Security tests**: File validation and security features must be tested
- **Coverage**: Minimum 80% code coverage

### Pull Request Process

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

2. **Make your changes:**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed
   - Follow code style guidelines

3. **Test your changes:**
```bash
# Backend tests
pytest

# Frontend tests
npm test

# Security checks
safety check
bandit -r backend/

# Style checks
black --check backend/
flake8 backend/
npm run lint
```

4. **Commit and push:**
```bash
git add .
git commit -m "feat: add new conversion feature"
git push origin feature/your-feature-name
```

5. **Create Pull Request:**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request review from maintainers

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A description of what you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10, Ubuntu 20.04]
- Python version: [e.g. 3.9.0]
- Browser: [e.g. Chrome 96, Firefox 94]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## Code Review Guidelines

### For Authors
- Keep PRs small and focused
- Write clear commit messages
- Update documentation
- Add tests for new functionality
- Respond to feedback promptly

### For Reviewers
- Be constructive and respectful
- Focus on code quality and maintainability
- Check for security implications
- Verify tests are adequate
- Test the changes locally when needed

## Security Considerations

- Never commit sensitive data (keys, passwords, etc.)
- Validate all inputs thoroughly
- Consider security implications of changes
- Report security vulnerabilities privately
- Follow secure coding practices

## Documentation

### API Documentation
Update `docs/API.md` for:
- New endpoints
- Changed parameters
- New response formats
- Error codes

### Code Documentation
- Use docstrings for all functions and classes
- Include type hints
- Document complex algorithms
- Add inline comments for non-obvious code

### User Documentation
Update README.md for:
- New features visible to users
- Changed installation procedures
- New configuration options

## Release Process

1. **Version Bump:**
```bash
# Update version in setup.py, package.json
git commit -m "chore: bump version to x.y.z"
git tag vx.y.z
```

2. **Release Notes:**
```markdown
## [x.y.z] - YYYY-MM-DD

### Added
- New feature descriptions

### Changed
- Modified feature descriptions

### Fixed
- Bug fix descriptions

### Security
- Security improvements
```

3. **Deployment:**
- Create GitHub release
- Deploy to staging
- Run smoke tests
- Deploy to production

## Community

- **Discord**: [Community Server](https://discord.gg/conversor)
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Email**: maintainers@project.com

Thank you for contributing! 🎉