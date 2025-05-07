/**
 * Integration tests for the calculator UI and calculation modules
 */

// Import the necessary modules
const calculatorCore = require('../../assets/js/calculator-core.js');
const converterCore = require('../../assets/js/converter-core.js');

// Mock DOM elements and events for testing
class MockElement {
  constructor() {
    this.value = '';
    this.textContent = '';
    this.style = { display: 'none' };
    this.classList = {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn().mockReturnValue(false)
    };
    this.addEventListener = jest.fn();
    this.querySelectorAll = jest.fn().mockReturnValue([]);
    this.querySelector = jest.fn().mockReturnValue(null);
  }
}

// Mock document object
global.document = {
  getElementById: jest.fn().mockImplementation(() => new MockElement()),
  querySelector: jest.fn().mockImplementation(() => new MockElement()),
  querySelectorAll: jest.fn().mockReturnValue([]),
  createElement: jest.fn().mockImplementation(() => new MockElement()),
  addEventListener: jest.fn()
};

// Mock window object
global.window = {
  addEventListener: jest.fn()
};

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Mock alert function
global.alert = jest.fn();

// Basic calculator UI tests
describe('Calculator UI Integration', () => {
  // Setup mock Calculator object
  const Calculator = {
    currentInput: '0',
    memory: 0,
    lastOperation: '',
    lastNumber: '',
    waitingForOperand: false,
    history: [],
    
    elements: {
      input: new MockElement(),
      historyDisplay: new MockElement(),
      memoryDisplay: new MockElement(),
      historyList: new MockElement()
    },
    
    // Mock methods that would interact with the UI
    updateDisplay: jest.fn(),
    addToHistory: jest.fn(),
    clearHistory: jest.fn(),
    
    // Methods that use calculatorCore
    inputDigit: function(digit) {
      if (this.waitingForOperand) {
        this.currentInput = digit;
        this.waitingForOperand = false;
      } else {
        this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
      }
      this.updateDisplay();
    },
    
    calculate: function() {
      try {
        const result = calculatorCore.evaluate(this.currentInput);
        
        // Add to history
        this.addToHistory({
          expression: this.currentInput,
          result: result.toString()
        });
        
        this.currentInput = result.toString();
        this.waitingForOperand = true;
        this.updateDisplay();
        
        return result;
      } catch (error) {
        this.currentInput = 'Error';
        this.waitingForOperand = true;
        this.updateDisplay();
        return null;
      }
    }
  };

  // Reset Calculator state before each test
  beforeEach(() => {
    Calculator.currentInput = '0';
    Calculator.memory = 0;
    Calculator.lastOperation = '';
    Calculator.lastNumber = '';
    Calculator.waitingForOperand = false;
    Calculator.history = [];
    
    // Reset mock functions
    Calculator.updateDisplay.mockClear();
    Calculator.addToHistory.mockClear();
    Calculator.clearHistory.mockClear();
  });

  // Test inputting digits
  test('inputDigit updates currentInput correctly', () => {
    Calculator.inputDigit('1');
    expect(Calculator.currentInput).toBe('1');
    
    Calculator.inputDigit('2');
    expect(Calculator.currentInput).toBe('12');
    
    Calculator.inputDigit('3');
    expect(Calculator.currentInput).toBe('123');
    
    expect(Calculator.updateDisplay).toHaveBeenCalledTimes(3);
  });

  // Test calculation
  test('calculate evaluates expression correctly', () => {
    // Mock the evaluate function to return a specific value
    const originalEvaluate = calculatorCore.evaluate;
    calculatorCore.evaluate = jest.fn().mockReturnValue(5);
    
    Calculator.currentInput = '2 + 3';
    const result = Calculator.calculate();
    
    expect(result).toBe(5);
    expect(Calculator.currentInput).toBe('5');
    expect(Calculator.waitingForOperand).toBe(true);
    expect(Calculator.addToHistory).toHaveBeenCalledWith({
      expression: '2 + 3',
      result: '5'
    });
    expect(Calculator.updateDisplay).toHaveBeenCalled();
    
    // Restore the original function
    calculatorCore.evaluate = originalEvaluate;
  });

  // Test error handling
  test('calculate handles errors correctly', () => {
    // Mock the evaluate function to throw an error
    const originalEvaluate = calculatorCore.evaluate;
    calculatorCore.evaluate = jest.fn().mockImplementation(() => {
      throw new Error('Invalid expression');
    });
    
    Calculator.currentInput = 'invalid';
    const result = Calculator.calculate();
    
    expect(result).toBeNull();
    expect(Calculator.currentInput).toBe('Error');
    expect(Calculator.waitingForOperand).toBe(true);
    expect(Calculator.updateDisplay).toHaveBeenCalled();
    
    // Restore the original function
    calculatorCore.evaluate = originalEvaluate;
  });
});

// Unit converter UI tests
describe('Unit Converter UI Integration', () => {
  // Setup mock UnitConverter object
  const UnitConverter = {
    elements: {
      categorySelect: new MockElement(),
      fromUnitSelect: new MockElement(),
      toUnitSelect: new MockElement(),
      fromValueInput: new MockElement(),
      toValueInput: new MockElement(),
      swapButton: new MockElement(),
      clearButton: new MockElement()
    },
    
    // Mock methods that would interact with the UI
    updateUnitSelects: jest.fn(),
    convert: jest.fn(),
    
    // Method that uses converterCore
    performConversion: function() {
      try {
        const category = this.elements.categorySelect.value;
        const fromUnit = this.elements.fromUnitSelect.value;
        const toUnit = this.elements.toUnitSelect.value;
        const fromValue = parseFloat(this.elements.fromValueInput.value);
        
        if (isNaN(fromValue)) {
          this.elements.toValueInput.value = '';
          return;
        }
        
        const result = converterCore.convert(category, fromUnit, toUnit, fromValue);
        this.elements.toValueInput.value = result.toFixed(6);
        
        return result;
      } catch (error) {
        this.elements.toValueInput.value = 'Error';
        return null;
      }
    }
  };

  // Reset UnitConverter state before each test
  beforeEach(() => {
    // Reset mock elements
    UnitConverter.elements.categorySelect.value = 'length';
    UnitConverter.elements.fromUnitSelect.value = 'm';
    UnitConverter.elements.toUnitSelect.value = 'cm';
    UnitConverter.elements.fromValueInput.value = '1';
    UnitConverter.elements.toValueInput.value = '';
    
    // Reset mock functions
    UnitConverter.updateUnitSelects.mockClear();
    UnitConverter.convert.mockClear();
  });

  // Test conversion
  test('performConversion converts values correctly', () => {
    // Mock the convert function to return a specific value
    const originalConvert = converterCore.convert;
    converterCore.convert = jest.fn().mockReturnValue(100);
    
    const result = UnitConverter.performConversion();
    
    expect(result).toBe(100);
    expect(UnitConverter.elements.toValueInput.value).toBe('100.000000');
    expect(converterCore.convert).toHaveBeenCalledWith('length', 'm', 'cm', 1);
    
    // Restore the original function
    converterCore.convert = originalConvert;
  });

  // Test error handling
  test('performConversion handles errors correctly', () => {
    // Mock the convert function to throw an error
    const originalConvert = converterCore.convert;
    converterCore.convert = jest.fn().mockImplementation(() => {
      throw new Error('Invalid conversion');
    });
    
    const result = UnitConverter.performConversion();
    
    expect(result).toBeNull();
    expect(UnitConverter.elements.toValueInput.value).toBe('Error');
    
    // Restore the original function
    converterCore.convert = originalConvert;
  });

  // Test handling of invalid input
  test('performConversion handles invalid input correctly', () => {
    UnitConverter.elements.fromValueInput.value = 'not a number';
    
    UnitConverter.performConversion();
    
    expect(UnitConverter.elements.toValueInput.value).toBe('');
  });
});
