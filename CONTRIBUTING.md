# Contributing to open-Balancer

Thank you for your interest in contributing to open-Balancer! We welcome contributions from the community and are excited to work with you.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@open-balancer.org.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Docker** (for containerized development)
- **Google Cloud SDK** (for GCP integration testing)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/open-balancer.git
   cd open-balancer
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/open-balancer/open-balancer.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your development configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify the setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to the console at [http://localhost:3000/console/dashboard](http://localhost:3000/console/dashboard)

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new features or improvements
- **📝 Documentation**: Improve our docs, guides, and examples
- **🧪 Testing**: Add tests or improve test coverage
- **🔧 Code**: Fix bugs, implement features, or improve performance
- **🎨 Design**: Improve UI/UX or create visual assets
- **🌐 Translations**: Help make open-Balancer accessible globally

### Before You Start

1. **Check existing issues**: Look for existing issues or discussions about your idea
2. **Create an issue**: For significant changes, create an issue to discuss your approach
3. **Get feedback**: Engage with maintainers and community members
4. **Start small**: Consider starting with a small contribution to get familiar with the codebase

## Pull Request Process

### 1. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```bash
# Examples:
git commit -m "feat: add brownout threshold configuration"
git commit -m "fix: resolve dashboard loading issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for brownout manager"
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### 5. PR Requirements

Your pull request should:

- [ ] Have a clear title and description
- [ ] Reference any related issues
- [ ] Include tests for new functionality
- [ ] Update documentation if needed
- [ ] Pass all CI checks
- [ ] Be reviewed by at least one maintainer

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use strict mode settings

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### File Organization

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── console/        # Console-specific components
│   └── site/           # Site-specific components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Naming Conventions

- **Files**: Use kebab-case (`brownout-manager.ts`)
- **Components**: Use PascalCase (`BrownoutManager`)
- **Functions**: Use camelCase (`calculateThreshold`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- brownout-manager.test.ts

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for all new functions and components
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

```typescript
// Example test
describe('BrownoutManager', () => {
  it('should activate soft mode when latency exceeds threshold', () => {
    // Arrange
    const manager = new BrownoutManager(config);
    const metrics = { latency: 3000, errorRate: 0.02 };

    // Act
    const result = manager.evaluateMode(metrics);

    // Assert
    expect(result.mode).toBe('soft');
  });
});
```

### Test Categories

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Test system performance under load

## Documentation

### Types of Documentation

- **Code Comments**: Explain complex logic and decisions
- **API Documentation**: Document all public APIs
- **User Guides**: Help users understand features
- **Developer Guides**: Help contributors understand the codebase

### Writing Guidelines

- Use clear, concise language
- Include code examples
- Keep documentation up-to-date with code changes
- Use proper markdown formatting

### Documentation Structure

```
docs/
├── api/                # API reference
├── guides/             # User and developer guides
├── examples/           # Code examples
└── architecture/       # System architecture docs
```

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussions and questions
- **Discord**: Real-time chat with the community
- **Email**: contact@open-balancer.org

### Getting Help

- Check the [documentation](https://docs.open-balancer.org)
- Search existing [GitHub issues](https://github.com/open-balancer/open-balancer/issues)
- Ask questions in [GitHub Discussions](https://github.com/open-balancer/open-balancer/discussions)
- Join our [Discord server](https://discord.gg/open-balancer)

### Reporting Issues

When reporting bugs, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Logs**: Relevant error messages or logs

## Recognition

We value all contributions and recognize contributors in several ways:

- **Contributors List**: All contributors are listed in our README
- **Release Notes**: Significant contributions are mentioned in release notes
- **Hall of Fame**: Outstanding contributors are featured on our website
- **Swag**: Active contributors receive open-Balancer swag

## Questions?

If you have questions about contributing, please:

1. Check this guide and our documentation
2. Search existing issues and discussions
3. Ask in GitHub Discussions
4. Contact us at contribute@open-balancer.org

Thank you for contributing to open-Balancer! 🚀