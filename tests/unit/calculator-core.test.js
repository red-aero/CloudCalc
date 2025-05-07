/**
 * Unit tests for the calculator core module
 */

// Import the calculator core module
const calculatorCore = require('../../assets/js/calculator-core.js');

// Basic arithmetic operations tests
describe('Basic Arithmetic Operations', () => {
  // Addition tests
  test('adds 1 + 2 to equal 3', () => {
    expect(calculatorCore.add(1, 2)).toBe(3);
  });

  test('adds -1 + -2 to equal -3', () => {
    expect(calculatorCore.add(-1, -2)).toBe(-3);
  });

  test('adds 0.1 + 0.2 to be close to 0.3', () => {
    expect(calculatorCore.add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  // Subtraction tests
  test('subtracts 5 - 3 to equal 2', () => {
    expect(calculatorCore.subtract(5, 3)).toBe(2);
  });

  test('subtracts 3 - 5 to equal -2', () => {
    expect(calculatorCore.subtract(3, 5)).toBe(-2);
  });

  // Multiplication tests
  test('multiplies 2 * 3 to equal 6', () => {
    expect(calculatorCore.multiply(2, 3)).toBe(6);
  });

  test('multiplies 2 * -3 to equal -6', () => {
    expect(calculatorCore.multiply(2, -3)).toBe(-6);
  });

  // Division tests
  test('divides 6 / 3 to equal 2', () => {
    expect(calculatorCore.divide(6, 3)).toBe(2);
  });

  test('divides 6 / -3 to equal -2', () => {
    expect(calculatorCore.divide(6, -3)).toBe(-2);
  });

  test('throws error when dividing by zero', () => {
    expect(() => calculatorCore.divide(6, 0)).toThrow('Division by zero');
  });
});

// Advanced operations tests
describe('Advanced Mathematical Operations', () => {
  // Power tests
  test('calculates 2^3 to equal 8', () => {
    expect(calculatorCore.power(2, 3)).toBe(8);
  });

  test('calculates 2^-1 to equal 0.5', () => {
    expect(calculatorCore.power(2, -1)).toBe(0.5);
  });

  // Square root tests
  test('calculates sqrt(9) to equal 3', () => {
    expect(calculatorCore.sqrt(9)).toBe(3);
  });

  test('calculates sqrt(2) to be close to 1.414', () => {
    expect(calculatorCore.sqrt(2)).toBeCloseTo(1.414, 3);
  });

  test('throws error when calculating sqrt of negative number', () => {
    expect(() => calculatorCore.sqrt(-1)).toThrow('Cannot calculate square root of negative number');
  });

  // Percentage tests
  test('calculates 50% to equal 0.5', () => {
    expect(calculatorCore.percentage(50)).toBe(0.5);
  });

  // Factorial tests
  test('calculates 5! to equal 120', () => {
    expect(calculatorCore.factorial(5)).toBe(120);
  });

  test('calculates 0! to equal 1', () => {
    expect(calculatorCore.factorial(0)).toBe(1);
  });

  test('throws error when calculating factorial of negative number', () => {
    expect(() => calculatorCore.factorial(-1)).toThrow('Cannot calculate factorial of negative number');
  });

  test('throws error when calculating factorial of non-integer', () => {
    expect(() => calculatorCore.factorial(1.5)).toThrow('Cannot calculate factorial of non-integer');
  });
});

// Trigonometric functions tests
describe('Trigonometric Functions', () => {
  // Sine tests
  test('calculates sin(0) to equal 0', () => {
    expect(calculatorCore.sin(0)).toBe(0);
  });

  test('calculates sin(π/2) to be close to 1', () => {
    expect(calculatorCore.sin(Math.PI / 2)).toBeCloseTo(1);
  });

  // Cosine tests
  test('calculates cos(0) to equal 1', () => {
    expect(calculatorCore.cos(0)).toBe(1);
  });

  test('calculates cos(π) to be close to -1', () => {
    expect(calculatorCore.cos(Math.PI)).toBeCloseTo(-1);
  });

  // Tangent tests
  test('calculates tan(0) to equal 0', () => {
    expect(calculatorCore.tan(0)).toBe(0);
  });

  test('calculates tan(π/4) to be close to 1', () => {
    expect(calculatorCore.tan(Math.PI / 4)).toBeCloseTo(1);
  });
});

// Logarithmic functions tests
describe('Logarithmic Functions', () => {
  // Natural logarithm tests
  test('calculates ln(1) to equal 0', () => {
    expect(calculatorCore.ln(1)).toBe(0);
  });

  test('calculates ln(e) to be close to 1', () => {
    expect(calculatorCore.ln(Math.E)).toBeCloseTo(1);
  });

  test('throws error when calculating ln of non-positive number', () => {
    expect(() => calculatorCore.ln(0)).toThrow('Cannot calculate logarithm of non-positive number');
    expect(() => calculatorCore.ln(-1)).toThrow('Cannot calculate logarithm of non-positive number');
  });

  // Base-10 logarithm tests
  test('calculates log10(1) to equal 0', () => {
    expect(calculatorCore.log10(1)).toBe(0);
  });

  test('calculates log10(10) to equal 1', () => {
    expect(calculatorCore.log10(10)).toBe(1);
  });

  test('calculates log10(100) to equal 2', () => {
    expect(calculatorCore.log10(100)).toBe(2);
  });

  test('throws error when calculating log10 of non-positive number', () => {
    expect(() => calculatorCore.log10(0)).toThrow('Cannot calculate logarithm of non-positive number');
    expect(() => calculatorCore.log10(-1)).toThrow('Cannot calculate logarithm of non-positive number');
  });
});

// Expression evaluation tests
describe('Expression Evaluation', () => {
  test('evaluates "2 + 3 * 4" to equal 14', () => {
    expect(calculatorCore.evaluate('2 + 3 * 4')).toBe(14);
  });

  test('evaluates "(2 + 3) * 4" to equal 20', () => {
    expect(calculatorCore.evaluate('(2 + 3) * 4')).toBe(20);
  });

  test('evaluates "sqrt(16) + 2" to equal 6', () => {
    expect(calculatorCore.evaluate('sqrt(16) + 2')).toBe(6);
  });

  test('throws error when evaluating invalid expression', () => {
    expect(() => calculatorCore.evaluate('2 +')).toThrow('Invalid expression');
  });
});
