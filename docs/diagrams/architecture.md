# CloudCalc Architecture Diagrams

## System Architecture Overview

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

## Component Interaction Diagram

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

## Data Flow Diagram

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  User Input    | --> |  Validation    | --> |  Processing    |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
                                                      |
                                                      v
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Display       | <-- |  Formatting    | <-- |  Calculation   |
|  Results       |     |  Results       |     |  Logic         |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
        |
        v
+----------------+     +----------------+
|                |     |                |
|  Save to       | --> |  Update        |
|  History       |     |  History UI    |
|                |     |                |
+----------------+     +----------------+
```

## Authentication Flow

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

## Unit Conversion Flow

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Select        | --> |  Enter input   | --> |  Select output |
|  category      |     |  value & unit  |     |  unit          |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
                                                      |
                                                      v
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Display       | <-- |  Format        | <-- |  Convert to    |
|  result        |     |  result        |     |  output unit   |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
```

## Deployment Architecture (App Engine)

```
+----------------------------------+
|                                  |
|  Google Cloud Platform           |
|  +----------------------------+  |
|  |                            |  |
|  |  App Engine                |  |
|  |  +----------------------+  |  |
|  |  |                      |  |  |
|  |  |  CloudCalc App       |  |  |
|  |  |  (Node.js Runtime)   |  |  |
|  |  |                      |  |  |
|  |  +----------------------+  |  |
|  |                            |  |
|  +----------------------------+  |
|  |                            |  |
|  |  Cloud Datastore           |  |
|  |  (Future Implementation)   |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
        |
        | HTTPS
        |
+-------v--------------------------+
|                                  |
|  End Users                       |
|  (Web Browsers)                  |
|                                  |
+----------------------------------+
```

These diagrams provide a visual representation of the CloudCalc application architecture, showing how different components interact and how data flows through the system.
