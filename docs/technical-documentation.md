# CloudCalc Technical Documentation

## Overview

CloudCalc is a modern calculator web application built with HTML, CSS, JavaScript, Node.js, and Express. It provides basic arithmetic operations, scientific calculations, and unit conversions in a responsive, user-friendly interface.

This technical documentation provides detailed information about the architecture, components, and implementation of CloudCalc.

## Table of Contents

1. [Architecture](#architecture)
2. [Frontend Components](#frontend-components)
3. [Backend Components](#backend-components)
4. [Data Flow](#data-flow)
5. [API Reference](#api-reference)
6. [Authentication](#authentication)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Performance Considerations](#performance-considerations)
10. [Security Considerations](#security-considerations)

## Architecture

CloudCalc follows a client-server architecture:

- **Frontend**: HTML, CSS, and JavaScript running in the browser
- **Backend**: Node.js with Express.js
- **Data Storage**: In-memory storage (with plans for database integration)

### System Architecture Diagram

```
+----------------------------------+
|                                  |
|  Client (Browser)                |
|  +----------------------------+  |
|  |                            |  |
|  |  Frontend Application      |  |
|  |  (HTML, CSS, JavaScript)   |  |
|  |                            |  |
|  +----------------------------+  |
|              |                   |
+--------------|-------------------+
               |
               | HTTP/HTTPS
               |
+--------------|-------------------+
|              |                   |
|  Server      v                   |
|  +----------------------------+  |
|  |                            |  |
|  |  Express.js Server         |  |
|  |                            |  |
|  +----------------------------+  |
|  |                            |  |
|  |  API Endpoints             |  |
|  |                            |  |
|  +----------------------------+  |
|  |                            |  |
|  |  In-Memory Data Storage    |  |
|  |  (Users, History, Tokens)  |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

## Frontend Components

### Core Modules

1. **Calculator Core (`calculator-core.js`)**
   - Handles mathematical operations
   - Provides pure calculation functions
   - Supports basic and scientific calculations

2. **Converter Core (`converter-core.js`)**
   - Handles unit conversions
   - Supports multiple categories (length, mass, temperature, etc.)
   - Provides conversion rates and utility functions

3. **API Client (`api/client.js`)**
   - Manages communication with the backend
   - Handles API requests and responses
   - Provides error handling and fallback mechanisms

### UI Components

1. **Main Application (`app.js`)**
   - Initializes the application
   - Manages mode switching (Basic, Scientific, Converter)
   - Handles global events

2. **Calculator UI (`main.js`)**
   - Manages calculator display
   - Handles user input
   - Updates history

3. **User Authentication (`auth.js`)**
   - Handles user registration and login
   - Manages authentication tokens
   - Provides user session management

## Backend Components

### Server (`server.js`)

- Express.js application
- Serves static files
- Provides API endpoints
- Handles CORS and authentication

### API Endpoints

- User management (register, login, logout)
- History management (add, get, clear)
- Unit conversion

### Data Storage

Currently using in-memory storage for:
- User accounts
- Authentication tokens
- Calculation history

## Data Flow

### Component Interaction Diagram

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Auth Module   | --> |  Calculator    | --> |  History       |
|                |     |  Module        |     |  Module        |
+----------------+     +----------------+     +----------------+
        |                     |                      |
        v                     v                      v
+-------------------------------------------------------+
|                                                       |
|                   API Client                          |
|                                                       |
+-------------------------------------------------------+
        |                     |                      |
        v                     v                      v
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  User API      |     |  Calculation   |     |  History API   |
|  Endpoints     |     |  API Endpoints |     |  Endpoints     |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
        |                     |                      |
        v                     v                      v
+-------------------------------------------------------+
|                                                       |
|                   Data Storage                        |
|                                                       |
+-------------------------------------------------------+
```

### Calculation Flow

1. User enters input via UI
2. Input is validated
3. Calculation is performed by calculator-core.js
4. Result is displayed
5. Calculation is added to history
6. If user is logged in, history is synced with server

### Authentication Flow

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  User enters   | --> |  Client-side   | --> |  API request   |
|  credentials   |     |  validation    |     |  to server     |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
                                                      |
                                                      v
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Store token   | <-- |  Generate      | <-- |  Server        |
|  in client     |     |  auth token    |     |  validation    |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
        |
        v
+----------------+     +----------------+
|                |     |                |
|  Include token | --> |  Authorize     |
|  in API calls  |     |  API access    |
|                |     |                |
+----------------+     +----------------+
```

## API Reference

### User Management

#### Register User

- **Endpoint**: `/api/register`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```

#### Login User

- **Endpoint**: `/api/login`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "username": "string",
      "createdAt": "string"
    },
    "token": "string"
  }
  ```

#### Logout User

- **Endpoint**: `/api/logout`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### History Management

#### Get History

- **Endpoint**: `/api/history`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "history": [
      {
        "id": "number",
        "expression": "string",
        "result": "string",
        "timestamp": "string"
      }
    ]
  }
  ```

#### Add History Item

- **Endpoint**: `/api/history`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "expression": "string",
    "result": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "History item added",
    "item": {
      "id": "number",
      "expression": "string",
      "result": "string",
      "timestamp": "string"
    }
  }
  ```

#### Clear History

- **Endpoint**: `/api/history`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "History cleared"
  }
  ```

### Unit Conversion

- **Endpoint**: `/api/convert`
- **Method**: POST
- **Body**:
  ```json
  {
    "category": "string",
    "fromUnit": "string",
    "toUnit": "string",
    "value": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": "number"
  }
  ```

## Authentication

CloudCalc uses token-based authentication:

1. User registers or logs in
2. Server generates a token
3. Token is stored in the client
4. Token is included in API requests
5. Server validates token for protected endpoints

## Testing

CloudCalc includes comprehensive testing:

### Unit Tests

- Tests for calculator-core.js
- Tests for converter-core.js
- Ensures core functionality works correctly

### Integration Tests

- Tests for UI and calculation modules
- Tests for UI and conversion modules
- Ensures components work together correctly

### System Tests

- Tests for API endpoints
- Tests for authentication flow
- Ensures the entire system works correctly

## Deployment

CloudCalc is configured for deployment to Google App Engine:

### Deployment Configuration

- `app.yaml` defines the App Engine configuration
- Node.js runtime
- Automatic scaling
- HTTPS enforcement

### Deployment Environments

- **Development**: Local environment for development
- **Staging**: App Engine instance for testing
- **Production**: App Engine instance for users

## Performance Considerations

- Client-side calculations for immediate feedback
- Minimal server requests
- Efficient conversion algorithms
- Responsive design for all devices

## Security Considerations

- HTTPS for all communications
- Token-based authentication
- Input validation
- Secure password handling
- CORS configuration

---

This documentation is maintained by the CloudCalc development team. For questions or updates, please contact the team at dev@cloudcalc.com.
