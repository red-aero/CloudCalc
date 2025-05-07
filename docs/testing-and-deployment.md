# CloudCalc Testing and Deployment Guide

This guide provides instructions for running tests and deploying the CloudCalc application to different environments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Cloud SDK (for deployment to App Engine)

## Setting Up the Development Environment

1. Clone the repository:
   ```
   git clone https://github.com/YOUR_USERNAME/CloudCalc.git
   cd CloudCalc
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3001
   ```

## Running Tests

### Unit Tests

Unit tests focus on testing individual components in isolation.

```
npm run test:unit
```

This will run all tests in the `tests/unit` directory.

### Integration Tests

Integration tests focus on testing the interaction between components.

```
npm run test:integration
```

This will run all tests in the `tests/integration` directory.

### System Tests

System tests focus on testing the entire application in a production-like environment.

```
npm run test:system
```

This will run all tests in the `tests/system` directory.

Note: System tests require a running instance of the application. You can either run the tests against a local instance or a deployed instance by setting the `API_URL` environment variable:

```
API_URL=https://your-app-url.appspot.com npm run test:system
```

### All Tests

To run all tests:

```
npm test
```

### Test Coverage

To generate a test coverage report:

```
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory. Open `coverage/lcov-report/index.html` in your browser to view the report.

## Deployment

### Deploying to App Engine

1. Make sure you have the Google Cloud SDK installed and configured:
   ```
   gcloud auth login
   gcloud config set project your-project-id
   ```

2. Deploy to App Engine:
   ```
   gcloud app deploy app.yaml
   ```

3. Open the deployed application:
   ```
   gcloud app browse
   ```

### Deployment Environments

#### Staging Environment

The staging environment is used for testing before deploying to production.

```
gcloud app deploy app.yaml --version staging --no-promote
```

This will deploy the application to a new version named "staging" without making it the default version. You can access the staging version at:

```
https://staging-dot-your-project-id.appspot.com
```

#### Production Environment

The production environment is the live environment that users access.

```
gcloud app deploy app.yaml --version production
```

This will deploy the application to a new version named "production" and make it the default version. You can access the production version at:

```
https://your-project-id.appspot.com
```

## Continuous Integration and Deployment

### GitHub Actions

The repository includes GitHub Actions workflows for continuous integration and deployment:

- `ci.yml`: Runs tests on every push and pull request
- `cd-staging.yml`: Deploys to the staging environment on every push to the `develop` branch
- `cd-production.yml`: Deploys to the production environment on every push to the `main` branch

### Setting Up GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_SA_KEY`: Your Google Cloud service account key (base64 encoded)

2. Push to the appropriate branch to trigger the workflow:
   - Push to `develop` to deploy to staging
   - Push to `main` to deploy to production

## Monitoring and Logging

### App Engine Monitoring

You can monitor your App Engine application using the Google Cloud Console:

```
https://console.cloud.google.com/appengine/services?project=your-project-id
```

### Logging

You can view logs for your App Engine application using the Google Cloud Console:

```
https://console.cloud.google.com/logs/query?project=your-project-id
```

Or using the gcloud command:

```
gcloud app logs tail -s default
```

## Troubleshooting

### Common Issues

#### Tests Failing

- Make sure all dependencies are installed: `npm install`
- Check for syntax errors in your code
- Check for environment-specific issues (e.g., file paths)

#### Deployment Failing

- Make sure you have the correct permissions for your Google Cloud project
- Check for syntax errors in your `app.yaml` file
- Check for unsupported features in your code

#### Application Not Working

- Check the logs for errors
- Make sure the application is running on the correct port
- Check for CORS issues if making API requests from a different domain

### Getting Help

If you encounter issues that you can't resolve, please:

1. Check the existing issues in the GitHub repository
2. Create a new issue with detailed information about the problem
3. Contact the development team for assistance
