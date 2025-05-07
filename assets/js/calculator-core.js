/**
 * Core Calculator Module
 * Contains pure calculation functions that can be easily tested
 */

// Basic arithmetic operations
const calculatorCore = {
  /**
   * Add two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  add: function(a, b) {
    return parseFloat(a) + parseFloat(b);
  },

  /**
   * Subtract b from a
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  subtract: function(a, b) {
    return parseFloat(a) - parseFloat(b);
  },

  /**
   * Multiply two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  multiply: function(a, b) {
    return parseFloat(a) * parseFloat(b);
  },

  /**
   * Divide a by b
   * @param {number} a - Dividend
   * @param {number} b - Divisor
   * @returns {number} Quotient of a and b
   * @throws {Error} If b is zero
   */
  divide: function(a, b) {
    if (parseFloat(b) === 0) {
      throw new Error("Division by zero");
    }
    return parseFloat(a) / parseFloat(b);
  },

  /**
   * Calculate a to the power of b
   * @param {number} a - Base
   * @param {number} b - Exponent
   * @returns {number} a raised to the power of b
   */
  power: function(a, b) {
    return Math.pow(parseFloat(a), parseFloat(b));
  },

  /**
   * Calculate the square root of a number
   * @param {number} a - Number
   * @returns {number} Square root of a
   * @throws {Error} If a is negative
   */
  sqrt: function(a) {
    if (parseFloat(a) < 0) {
      throw new Error("Cannot calculate square root of negative number");
    }
    return Math.sqrt(parseFloat(a));
  },

  /**
   * Calculate the percentage of a number
   * @param {number} a - Number
   * @returns {number} a divided by 100
   */
  percentage: function(a) {
    return parseFloat(a) / 100;
  },

  /**
   * Calculate the factorial of a number
   * @param {number} a - Number
   * @returns {number} Factorial of a
   * @throws {Error} If a is negative or not an integer
   */
  factorial: function(a) {
    const num = parseFloat(a);
    
    // Check if the number is negative
    if (num < 0) {
      throw new Error("Cannot calculate factorial of negative number");
    }
    
    // Check if the number is an integer
    if (!Number.isInteger(num)) {
      throw new Error("Cannot calculate factorial of non-integer");
    }
    
    // Calculate factorial
    if (num === 0 || num === 1) {
      return 1;
    }
    
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    
    return result;
  },

  /**
   * Calculate the sine of an angle
   * @param {number} angle - Angle in radians
   * @returns {number} Sine of the angle
   */
  sin: function(angle) {
    return Math.sin(parseFloat(angle));
  },

  /**
   * Calculate the cosine of an angle
   * @param {number} angle - Angle in radians
   * @returns {number} Cosine of the angle
   */
  cos: function(angle) {
    return Math.cos(parseFloat(angle));
  },

  /**
   * Calculate the tangent of an angle
   * @param {number} angle - Angle in radians
   * @returns {number} Tangent of the angle
   */
  tan: function(angle) {
    return Math.tan(parseFloat(angle));
  },

  /**
   * Calculate the natural logarithm (base e) of a number
   * @param {number} a - Number
   * @returns {number} Natural logarithm of a
   * @throws {Error} If a is negative or zero
   */
  ln: function(a) {
    if (parseFloat(a) <= 0) {
      throw new Error("Cannot calculate logarithm of non-positive number");
    }
    return Math.log(parseFloat(a));
  },

  /**
   * Calculate the base-10 logarithm of a number
   * @param {number} a - Number
   * @returns {number} Base-10 logarithm of a
   * @throws {Error} If a is negative or zero
   */
  log10: function(a) {
    if (parseFloat(a) <= 0) {
      throw new Error("Cannot calculate logarithm of non-positive number");
    }
    return Math.log10(parseFloat(a));
  },

  /**
   * Evaluate a mathematical expression
   * @param {string} expression - Mathematical expression as a string
   * @returns {number} Result of the evaluation
   * @throws {Error} If the expression is invalid
   */
  evaluate: function(expression) {
    try {
      // This is a simplified version for demonstration
      // In a real app, you would use a proper expression parser
      // to avoid security issues with eval()
      
      // Replace common mathematical functions
      const sanitizedExpression = expression
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');
      
      // Evaluate the expression
      // Note: eval is used here for simplicity, but it's not recommended for production
      const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }
      
      return result;
    } catch (error) {
      throw new Error("Invalid expression: " + error.message);
    }
  }
};

// Export the module for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculatorCore;
}
