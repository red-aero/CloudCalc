/**
 * Main JavaScript file for the Modern Calculator application
 * Initializes all components and handles the application startup
 */

// Initialize the calculator and auth when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing application...');

        // Initialize the API client
        if (typeof API !== 'undefined') {
            API.init();
        }

        // Initialize Auth
        Auth.init();

        // Initialize Calculator
        Calculator.init();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Failed to initialize application. Please refresh the page and try again.');
    }
});

// API Integration Functions
async function registerAccount(username, password) {
    try {
        if (!username || !password) {
            alert('Username and password are required');
            return { success: false, message: 'Username and password are required' };
        }

        if (username.length < 3) {
            alert('Username must be at least 3 characters long');
            return { success: false, message: 'Username must be at least 3 characters long' };
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return { success: false, message: 'Password must be at least 6 characters long' };
        }

        // Register user using the API client
        if (typeof API !== 'undefined' && API.users && API.users.register) {
            try {
                const result = await API.users.register(username, password);
                console.log('Registration successful:', result);
                return result;
            } catch (apiError) {
                console.error('API registration error:', apiError);

                // Check if it's a network error (server not available)
                if (apiError.message.includes('Failed to fetch') ||
                    apiError.message.includes('Network Error')) {
                    console.warn('API server not available, falling back to local storage');
                    // Fall through to local storage fallback
                } else {
                    // It's an API error, not a network error
                    alert(`Registration failed: ${apiError.message}`);
                    return { success: false, message: apiError.message };
                }
            }
        }

        // Fallback to local storage if API is not available or network error
        console.log('Using local storage fallback for registration');
        const existingUser = localStorage.getItem(`user_${username}`);
        if (existingUser) {
            alert('Username already exists');
            return { success: false, message: 'Username already exists' };
        }

        // Simple password hashing (not secure, just for demo)
        const hashedPassword = hashPassword(password);

        // Store user
        const user = {
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(`user_${username}`, JSON.stringify(user));

        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error('Error registering account:', error);
        alert(`Failed to register account: ${error.message}`);
        return { success: false, message: error.message };
    }
}

async function signIn(username, password) {
    try {
        if (!username || !password) {
            alert('Username and password are required');
            return { success: false, message: 'Username and password are required' };
        }

        // Login user using the API client
        if (typeof API !== 'undefined' && API.users && API.users.login) {
            try {
                const result = await API.users.login(username, password);
                console.log('Login successful:', result);
                return result;
            } catch (apiError) {
                console.error('API login error:', apiError);

                // Check if it's a network error (server not available)
                if (apiError.message.includes('Failed to fetch') ||
                    apiError.message.includes('Network Error')) {
                    console.warn('API server not available, falling back to local storage');
                    // Fall through to local storage fallback
                } else {
                    // It's an API error, not a network error
                    alert(`Login failed: ${apiError.message}`);
                    return { success: false, message: apiError.message };
                }
            }
        }

        // Fallback to local storage if API is not available or network error
        console.log('Using local storage fallback for login');
        const userJson = localStorage.getItem(`user_${username}`);
        if (!userJson) {
            alert('User not found');
            return { success: false, message: 'User not found' };
        }

        const user = JSON.parse(userJson);
        const hashedPassword = hashPassword(password);

        if (user.password !== hashedPassword) {
            alert('Invalid password');
            return { success: false, message: 'Invalid password' };
        }

        // Generate token
        const token = generateToken();

        return {
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                createdAt: user.createdAt
            },
            token
        };
    } catch (error) {
        console.error('Error signing in:', error);
        alert(`Failed to sign in: ${error.message}`);
        return { success: false, message: error.message };
    }
}

// History API functions
async function addHistoryLine(username, record) {
    try {
        if (!username) {
            console.error('Username is required to add history');
            return { success: false, message: 'Username is required' };
        }

        // Add history item using the API client
        if (typeof API !== 'undefined' && API.history && API.history.add) {
            const result = await API.history.add(record.expression, record.result);
            return { success: true, item: result };
        } else {
            // Fallback to local storage if API is not available
            const historyKey = `history_${username}`;
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

            const historyItem = {
                id: Date.now(),
                expression: record.expression,
                result: record.result,
                timestamp: new Date().toISOString()
            };

            history.unshift(historyItem);
            localStorage.setItem(historyKey, JSON.stringify(history));

            return { success: true, item: historyItem };
        }
    } catch (error) {
        console.error('Error adding history line:', error);
        return { success: false, message: error.message };
    }
}

async function getLastNHistoryLines(username, n = 10) {
    try {
        if (!username) {
            console.error('Username is required to get history');
            return [];
        }

        // Get history items using the API client
        if (typeof API !== 'undefined' && API.history && API.history.getAll) {
            const historyItems = await API.history.getAll();

            // Sort by timestamp (newest first) and limit to n items
            return historyItems
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, n);
        } else {
            // Fallback to local storage if API is not available
            const historyKey = `history_${username}`;
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

            return history.slice(0, n);
        }
    } catch (error) {
        console.error('Error retrieving history lines:', error);
        return [];
    }
}

// Clear history for a user
async function clearHistory(username) {
    try {
        if (!username) {
            console.error('Username is required to clear history');
            return { success: false, message: 'Username is required' };
        }

        // Clear history items using the API client
        if (typeof API !== 'undefined' && API.history && API.history.clear) {
            return await API.history.clear();
        } else {
            // Fallback to local storage if API is not available
            const historyKey = `history_${username}`;
            localStorage.removeItem(historyKey);

            return { success: true, message: 'History cleared successfully' };
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        return { success: false, message: error.message };
    }
}

// Helper functions
function hashPassword(password) {
    // Simple hash function (use bcrypt in production)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

function generateToken() {
    // Simple token generation (use JWT in production)
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
}
