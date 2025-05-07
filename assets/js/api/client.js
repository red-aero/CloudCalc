/**
 * API Client for Calculator App
 * Handles communication with the server API
 */
const API = {
    // Base URL for API requests
    baseUrl: 'http://localhost:3000/api',
    
    // Current authentication token
    authToken: null,
    
    // Initialize the API client
    init() {
        // Check for saved token in localStorage
        this.authToken = localStorage.getItem('calculatorToken');
    },
    
    // Set authentication token
    setAuthToken(token) {
        this.authToken = token;
        if (token) {
            localStorage.setItem('calculatorToken', token);
        } else {
            localStorage.removeItem('calculatorToken');
        }
    },
    
    // Get headers for authenticated requests
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    },
    
    // User Management
    users: {
        // Register a new user
        async register(username, password) {
            try {
                const response = await fetch(`${API.baseUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        // Login a user
        async login(username, password) {
            try {
                const response = await fetch(`${API.baseUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }
                
                // Save token
                API.setAuthToken(data.token);
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        // Logout a user
        async logout() {
            try {
                if (!API.authToken) {
                    // Already logged out
                    return { success: true };
                }
                
                const response = await fetch(`${API.baseUrl}/logout`, {
                    method: 'POST',
                    headers: API.getHeaders()
                });
                
                const data = await response.json();
                
                // Clear token regardless of response
                API.setAuthToken(null);
                
                if (!response.ok) {
                    throw new Error(data.message || 'Logout failed');
                }
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                // Clear token on error as well
                API.setAuthToken(null);
                throw error;
            }
        }
    },
    
    // History Management
    history: {
        // Get user history
        async getAll() {
            try {
                const response = await fetch(`${API.baseUrl}/history`, {
                    method: 'GET',
                    headers: API.getHeaders()
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch history');
                }
                
                return data.history;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        // Add history item
        async add(expression, result) {
            try {
                const response = await fetch(`${API.baseUrl}/history`, {
                    method: 'POST',
                    headers: API.getHeaders(),
                    body: JSON.stringify({ expression, result })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to add history item');
                }
                
                return data.item;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        // Clear history
        async clear() {
            try {
                const response = await fetch(`${API.baseUrl}/history`, {
                    method: 'DELETE',
                    headers: API.getHeaders()
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to clear history');
                }
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }
    },
    
    // Unit Conversion
    conversion: {
        // Convert units
        async convert(category, fromUnit, toUnit, value) {
            try {
                const response = await fetch(`${API.baseUrl}/convert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ category, fromUnit, toUnit, value })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Conversion failed');
                }
                
                return data.result;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }
    }
};
