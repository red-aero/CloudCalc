/**
 * Main application components for the Modern Calculator
 * Contains Auth and Calculator objects
 */

// Authentication and User Management
const Auth = {
    // User state
    currentUser: null,
    isLoggedIn: false,
    isGuest: false,
    authToken: null,

    // DOM Elements
    elements: {},

    // Initialize authentication
    init() {
        // Initialize DOM elements
        this.elements = {
            authOverlay: document.getElementById('auth_overlay'),
            calculatorContainer: document.getElementById('calculator_container'),
            loginForm: document.getElementById('login_form'),
            registerForm: document.getElementById('register_form'),
            loginTab: document.getElementById('login_tab'),
            registerTab: document.getElementById('register_tab'),
            guestModeBtn: document.getElementById('guest_mode_btn'),
            usernameDisplay: document.getElementById('username_display'),
            logoutBtn: document.getElementById('logout_btn')
        };

        // Check if user is already logged in (from localStorage)
        this.checkAuthState();

        // Add event listeners for auth forms
        this.elements.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.elements.registerForm.addEventListener('submit', this.handleRegister.bind(this));
        this.elements.loginTab.addEventListener('click', this.showLoginForm.bind(this));
        this.elements.registerTab.addEventListener('click', this.showRegisterForm.bind(this));
        this.elements.guestModeBtn.addEventListener('click', this.enterGuestMode.bind(this));
        this.elements.logoutBtn.addEventListener('click', this.logout.bind(this));
    },

    // Check if user is already logged in
    checkAuthState() {
        const savedUser = localStorage.getItem('calculatorUser');
        const savedToken = localStorage.getItem('calculatorToken');

        if (savedUser && savedToken) {
            this.currentUser = JSON.parse(savedUser);
            this.authToken = savedToken;
            this.isLoggedIn = true;
            this.showCalculator();
        }
    },

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('login_username').value.trim();
        const password = document.getElementById('login_password').value;
        const submitButton = document.querySelector('#login_form .auth-button');

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        try {
            // Show loading indicator
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            const result = await signIn(username, password);

            // Hide loading indicator
            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            if (result.success) {
                this.setLoggedInUser(result.user, result.token);

                // Fetch user history from database
                await this.fetchUserHistory();

                // Show success message
                alert('Logged in successfully!');
            }
        } catch (error) {
            console.error('Login error:', error);

            // Hide loading indicator on error
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    },

    // Handle register form submission
    async handleRegister(event) {
        event.preventDefault();

        const username = document.getElementById('register_username').value.trim();
        const password = document.getElementById('register_password').value;
        const confirmPassword = document.getElementById('register_confirm_password').value;
        const submitButton = document.querySelector('#register_form .auth-button');

        if (!username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Show loading indicator
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            const result = await registerAccount(username, password);

            // Hide loading indicator
            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            if (result.success) {
                // Switch to login form after successful registration
                this.showLoginForm();
                alert('Registration successful! Please log in.');

                // Clear the registration form
                document.getElementById('register_username').value = '';
                document.getElementById('register_password').value = '';
                document.getElementById('register_confirm_password').value = '';
            }
        } catch (error) {
            console.error('Registration error:', error);

            // Hide loading indicator on error
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    },

    // Set logged in user
    setLoggedInUser(user, token) {
        this.currentUser = user;
        this.authToken = token;
        this.isLoggedIn = true;
        this.isGuest = false;

        // Save to localStorage
        localStorage.setItem('calculatorUser', JSON.stringify(user));
        localStorage.setItem('calculatorToken', token);

        // Update UI
        this.elements.usernameDisplay.textContent = user.username;
        this.showCalculator();
    },

    // Enter guest mode
    enterGuestMode() {
        this.isGuest = true;
        this.isLoggedIn = false;
        this.currentUser = null;
        this.authToken = null;

        // Clear any saved auth data
        localStorage.removeItem('calculatorUser');
        localStorage.removeItem('calculatorToken');

        // Update UI
        this.elements.usernameDisplay.textContent = 'Guest';
        this.showCalculator();

        // Clear any existing history
        Calculator.clearHistory();
    },

    // Logout user
    logout() {
        this.currentUser = null;
        this.authToken = null;
        this.isLoggedIn = false;
        this.isGuest = false;

        // Clear saved auth data
        localStorage.removeItem('calculatorUser');
        localStorage.removeItem('calculatorToken');

        // Clear calculator history
        Calculator.clearHistory();

        // Show auth overlay
        this.showAuthOverlay();
    },

    // Show login form
    showLoginForm() {
        this.elements.loginForm.style.display = 'block';
        this.elements.registerForm.style.display = 'none';
        this.elements.loginTab.classList.add('active');
        this.elements.registerTab.classList.remove('active');
    },

    // Show register form
    showRegisterForm() {
        this.elements.loginForm.style.display = 'none';
        this.elements.registerForm.style.display = 'block';
        this.elements.loginTab.classList.remove('active');
        this.elements.registerTab.classList.add('active');
    },

    // Show calculator (hide auth overlay)
    showCalculator() {
        this.elements.authOverlay.style.display = 'none';
        this.elements.calculatorContainer.style.display = 'block';
    },

    // Show auth overlay (hide calculator)
    showAuthOverlay() {
        this.elements.authOverlay.style.display = 'flex';
        this.elements.calculatorContainer.style.display = 'none';
    },

    // Fetch user history from database
    async fetchUserHistory() {
        if (!this.isLoggedIn || !this.currentUser) return;

        try {
            const history = await getLastNHistoryLines(this.currentUser.username, 10);
            if (history && history.length > 0) {
                // Update calculator history
                Calculator.setHistory(history);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    },

    // Save history to database
    async saveHistoryToDatabase(historyItem) {
        if (!this.isLoggedIn || !this.currentUser) return;

        try {
            await addHistoryLine(this.currentUser.username, historyItem);
        } catch (error) {
            console.error('Error saving history to database:', error);
        }
    },

    // Clear user history
    async clearUserHistory() {
        if (!this.isLoggedIn || !this.currentUser) return;

        try {
            await clearHistory(this.currentUser.username);
            // Update calculator history
            Calculator.clearHistory();
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }
};

// Enhanced Calculator functionality
const Calculator = {
    currentInput: '0',
    memory: 0,
    lastOperation: '',
    lastNumber: '',
    waitingForOperand: false,
    history: [],
    scientificMode: false,

    // DOM Elements
    elements: {},

    // Calculator modes
    modes: {
        BASIC: 'basic',
        SCIENTIFIC: 'scientific',
        CONVERSION: 'conversion'
    },

    // Current mode
    currentMode: 'basic',

    // Initialize the calculator
    init() {
        // Initialize DOM elements
        this.elements = {
            input: document.getElementById('input_field'),
            historyDisplay: document.getElementById('history_display'),
            memoryDisplay: document.getElementById('memory_display'),
            historyContainer: document.getElementById('history_container'),
            historyList: document.getElementById('history_list'),
            scientificKeypad: document.getElementById('scientific_keypad'),
            conversionKeypad: document.getElementById('conversion_keypad'),
            basicModeBtn: document.getElementById('basic_mode'),
            scientificModeBtn: document.getElementById('scientific_mode'),
            conversionModeBtn: document.getElementById('conversion_mode')
        };

        // Add event listeners
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.getElementById('calculator_keypad').addEventListener('click', this.handleClick.bind(this));
        document.getElementById('scientific_keypad').addEventListener('click', this.handleClick.bind(this));
        document.querySelector('.calculator-memory').addEventListener('click', this.handleClick.bind(this));
        document.getElementById('clear_history').addEventListener('click', this.clearHistory.bind(this));
        this.elements.basicModeBtn.addEventListener('click', this.setBasicMode.bind(this));
        this.elements.scientificModeBtn.addEventListener('click', this.setScientificMode.bind(this));
        this.elements.conversionModeBtn.addEventListener('click', this.setConversionMode.bind(this));

        // Load history from localStorage if in guest mode
        if (Auth.isGuest) {
            this.loadHistory();
        }

        // Initialize the unit converter
        if (typeof UnitConverter !== 'undefined') {
            UnitConverter.init();
        }

        this.updateDisplay();
    },

    // Handle button clicks
    handleClick(event) {
        const target = event.target;
        if (target.tagName !== 'BUTTON') return;

        const value = target.textContent;
        const action = target.dataset.action;

        if (!action) {
            // Number button
            this.inputDigit(value);
        } else {
            // Action button
            this.performAction(action);
        }

        this.updateDisplay();
    },

    // Handle keyboard input
    handleKeydown(event) {
        // Don't handle keyboard events if in conversion mode
        if (this.currentMode === this.modes.CONVERSION) {
            return;
        }

        // Don't handle keyboard events if we're in a form field
        // or if the calculator input field is focused
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA') {
            // Only handle events for the calculator input field
            if (document.activeElement.id === 'input_field') {
                // Allow calculator input field to handle events
            } else {
                // Don't handle events for other input fields
                return;
            }
        }

        const key = event.key;

        // Prevent default for calculator keys to avoid page scrolling
        if (/^[0-9+\-*/.=]$/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
            event.preventDefault();
        }

        // Number keys
        if (/^[0-9]$/.test(key)) {
            this.inputDigit(key);
        }
        // Operator keys
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.performAction(key);
        }
        // Decimal point
        else if (key === '.') {
            this.inputDecimal();
        }
        // Equal or Enter (only if not in a form)
        else if ((key === '=' || key === 'Enter') &&
                 !document.activeElement.closest('form')) {
            this.performAction('=');
        }
        // Clear (Escape)
        else if (key === 'Escape') {
            this.performAction('AC');
        }
        // Backspace
        else if (key === 'Backspace') {
            this.deleteLastDigit();
        }

        this.updateDisplay();
    },

    // Input a digit
    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentInput = digit;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
        }
    },

    // Input decimal point
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
    },

    // Delete the last digit
    deleteLastDigit() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    },

    // Perform calculator actions
    performAction(action) {
        switch (action) {
            case 'AC':
                this.clearAll();
                break;
            case '±':
                this.toggleSign();
                break;
            case '%':
                this.percentage();
                break;
            case '=':
                this.calculate();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            case 'pow':
            case 'mod':
                this.handleOperator(action);
                break;
            case 'MC':
                this.memoryClear();
                break;
            case 'MR':
                this.memoryRecall();
                break;
            case 'M+':
                this.memoryAdd();
                break;
            case 'M-':
                this.memorySubtract();
                break;
            // Scientific functions
            case 'sin':
            case 'cos':
            case 'tan':
            case 'asin':
            case 'acos':
            case 'atan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'fact':
                this.scientificFunction(action);
                break;
            case 'pi':
                this.currentInput = Math.PI.toString();
                this.waitingForOperand = true;
                break;
            case 'e':
                this.currentInput = Math.E.toString();
                this.waitingForOperand = true;
                break;
            case 'exp':
                this.currentInput += 'e+0';
                break;
        }
    },

    // Clear all calculator state
    clearAll() {
        this.currentInput = '0';
        this.lastOperation = '';
        this.lastNumber = '';
        this.waitingForOperand = false;
        this.elements.historyDisplay.textContent = '';
    },

    // Toggle the sign of the current number
    toggleSign() {
        this.currentInput = (parseFloat(this.currentInput) * -1).toString();
    },

    // Calculate percentage
    percentage() {
        const value = parseFloat(this.currentInput);
        this.currentInput = (value / 100).toString();
    },

    // Handle operators (+, -, *, /)
    handleOperator(operator) {
        if (this.lastOperation && !this.waitingForOperand) {
            this.calculate();
        } else if (this.lastOperation === '') {
            this.lastNumber = this.currentInput;
        }

        this.lastOperation = operator;
        this.waitingForOperand = true;
        this.elements.historyDisplay.textContent = `${this.lastNumber} ${this.getOperatorSymbol(operator)}`;
    },

    // Get the display symbol for an operator
    getOperatorSymbol(operator) {
        switch (operator) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            case 'pow': return '^';
            case 'mod': return 'mod';
            default: return operator;
        }
    },

    // Perform calculation
    calculate() {
        if (!this.lastOperation) return;

        const currentValue = parseFloat(this.currentInput);
        const previousValue = parseFloat(this.lastNumber);
        let newValue;

        switch (this.lastOperation) {
            case '+':
                newValue = previousValue + currentValue;
                break;
            case '-':
                newValue = previousValue - currentValue;
                break;
            case '*':
                newValue = previousValue * currentValue;
                break;
            case '/':
                newValue = previousValue / currentValue;
                break;
            case 'pow':
                newValue = Math.pow(previousValue, currentValue);
                break;
            case 'mod':
                newValue = previousValue % currentValue;
                break;
        }

        // Format the expression for history
        const expression = `${this.lastNumber} ${this.getOperatorSymbol(this.lastOperation)} ${this.currentInput}`;
        this.elements.historyDisplay.textContent = `${expression} =`;

        // Add to history
        this.addToHistory(expression, newValue);

        this.currentInput = newValue.toString();
        this.lastOperation = '';
        this.waitingForOperand = true;
    },

    // Scientific functions
    scientificFunction(func) {
        const value = parseFloat(this.currentInput);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(value);
                break;
            case 'cos':
                result = Math.cos(value);
                break;
            case 'tan':
                result = Math.tan(value);
                break;
            case 'asin':
                result = Math.asin(value);
                break;
            case 'acos':
                result = Math.acos(value);
                break;
            case 'atan':
                result = Math.atan(value);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'fact':
                result = this.factorial(value);
                break;
        }

        // Add to history
        const expression = `${func}(${value})`;
        this.addToHistory(expression, result);

        this.currentInput = result.toString();
        this.waitingForOperand = true;
    },

    // Calculate factorial
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        if (n < 0) return NaN;
        if (n % 1 !== 0) return NaN; // Only integers
        if (n > 170) return Infinity; // Prevent overflow

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    },

    // Memory functions
    memoryClear() {
        this.memory = 0;
        this.elements.memoryDisplay.style.display = 'none';
    },

    memoryRecall() {
        this.currentInput = this.memory.toString();
        this.waitingForOperand = true;
    },

    memoryAdd() {
        this.memory += parseFloat(this.currentInput);
        this.elements.memoryDisplay.style.display = 'block';
        this.waitingForOperand = true;
    },

    memorySubtract() {
        this.memory -= parseFloat(this.currentInput);
        this.elements.memoryDisplay.style.display = 'block';
        this.waitingForOperand = true;
    },

    // Update the calculator display
    updateDisplay() {
        this.elements.input.value = this.currentInput;
    },

    // Add an item to history
    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result: result.toString(),
            timestamp: new Date().toISOString()
        };

        this.history.unshift(historyItem);
        this.updateHistoryDisplay();

        // Save to database if logged in
        if (Auth.isLoggedIn) {
            Auth.saveHistoryToDatabase(historyItem);
        } else if (Auth.isGuest) {
            // Save to localStorage if in guest mode
            this.saveHistory();
        }
    },

    // Update the history display
    updateHistoryDisplay() {
        if (!this.elements.historyList) return;

        this.elements.historyList.innerHTML = '';

        this.history.slice(0, 10).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            `;
            historyItem.addEventListener('click', () => {
                this.currentInput = item.result;
                this.updateDisplay();
            });
            this.elements.historyList.appendChild(historyItem);
        });

        // Show or hide history container based on history length
        if (this.history.length > 0) {
            this.elements.historyContainer.style.display = 'block';
        } else {
            this.elements.historyContainer.style.display = 'none';
        }
    },

    // Clear history
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();

        // Clear from database if logged in
        if (Auth.isLoggedIn) {
            Auth.clearUserHistory();
        } else if (Auth.isGuest) {
            // Clear from localStorage if in guest mode
            localStorage.removeItem('calculatorHistory');
        }
    },

    // Set history from external source
    setHistory(history) {
        this.history = history;
        this.updateHistoryDisplay();
    },

    // Save history to localStorage (for guest mode)
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    },

    // Load history from localStorage (for guest mode)
    loadHistory() {
        const savedHistory = localStorage.getItem('calculatorHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
    },

    // Set calculator mode
    setBasicMode() {
        this.currentMode = this.modes.BASIC;
        this.elements.basicModeBtn.classList.add('active');
        this.elements.scientificModeBtn.classList.remove('active');
        this.elements.conversionModeBtn.classList.remove('active');

        // Hide scientific keypad
        this.elements.scientificKeypad.style.display = 'none';

        // Show calculator keypad
        document.getElementById('calculator_keypad').style.display = 'grid';

        // Show memory options
        document.querySelector('.calculator-memory').style.display = 'block';

        // Hide conversion keypad
        this.elements.conversionKeypad.style.display = 'none';

        // Show calculator display
        this.elements.input.style.display = 'block';
        this.elements.historyDisplay.style.display = 'block';
    },

    setScientificMode() {
        this.currentMode = this.modes.SCIENTIFIC;
        this.elements.basicModeBtn.classList.remove('active');
        this.elements.scientificModeBtn.classList.add('active');
        this.elements.conversionModeBtn.classList.remove('active');

        // Show scientific keypad
        this.elements.scientificKeypad.style.display = 'grid';

        // Show calculator keypad
        document.getElementById('calculator_keypad').style.display = 'grid';

        // Show memory options
        document.querySelector('.calculator-memory').style.display = 'block';

        // Hide conversion keypad
        this.elements.conversionKeypad.style.display = 'none';

        // Show calculator display
        this.elements.input.style.display = 'block';
        this.elements.historyDisplay.style.display = 'block';
    },

    setConversionMode() {
        this.currentMode = this.modes.CONVERSION;
        this.elements.basicModeBtn.classList.remove('active');
        this.elements.scientificModeBtn.classList.remove('active');
        this.elements.conversionModeBtn.classList.add('active');

        // Hide scientific keypad
        this.elements.scientificKeypad.style.display = 'none';

        // Hide calculator keypad
        document.getElementById('calculator_keypad').style.display = 'none';

        // Hide memory options
        document.querySelector('.calculator-memory').style.display = 'none';

        // Show conversion keypad
        this.elements.conversionKeypad.style.display = 'block';

        // Hide calculator display
        this.elements.input.style.display = 'none';
        this.elements.historyDisplay.style.display = 'none';
    }
};