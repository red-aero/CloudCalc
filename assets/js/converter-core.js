/**
 * Unit Converter Core Module
 * Contains pure conversion functions that can be easily tested
 */

const converterCore = {
  /**
   * Conversion rates for different categories
   * Each unit is defined with its conversion rate to the base unit
   */
  conversionRates: {
    length: {
      mm: 0.001,      // millimeter to meter
      cm: 0.01,       // centimeter to meter
      m: 1,           // meter (base unit)
      km: 1000,       // kilometer to meter
      inch: 0.0254,   // inch to meter
      foot: 0.3048,   // foot to meter
      yard: 0.9144,   // yard to meter
      mile: 1609.34   // mile to meter
    },
    mass: {
      mg: 0.000001,   // milligram to kilogram
      g: 0.001,       // gram to kilogram
      kg: 1,          // kilogram (base unit)
      ton: 1000,      // metric ton to kilogram
      oz: 0.0283495,  // ounce to kilogram
      lb: 0.453592    // pound to kilogram
    },
    temperature: {
      celsius: 'special',     // requires special conversion
      fahrenheit: 'special',  // requires special conversion
      kelvin: 'special'       // requires special conversion
    },
    area: {
      mm2: 0.000001,  // square millimeter to square meter
      cm2: 0.0001,    // square centimeter to square meter
      m2: 1,          // square meter (base unit)
      km2: 1000000,   // square kilometer to square meter
      ha: 10000,      // hectare to square meter
      acre: 4046.86,  // acre to square meter
      ft2: 0.092903,  // square foot to square meter
      in2: 0.00064516 // square inch to square meter
    },
    volume: {
      ml: 0.000001,   // milliliter to cubic meter
      l: 0.001,       // liter to cubic meter
      m3: 1,          // cubic meter (base unit)
      gal: 0.00378541,// US gallon to cubic meter
      qt: 0.000946353,// US quart to cubic meter
      pt: 0.000473176,// US pint to cubic meter
      cup: 0.000236588,// US cup to cubic meter
      fl_oz: 0.0000295735 // US fluid ounce to cubic meter
    },
    time: {
      ms: 0.001,      // millisecond to second
      s: 1,           // second (base unit)
      min: 60,        // minute to second
      h: 3600,        // hour to second
      day: 86400,     // day to second
      week: 604800,   // week to second
      month: 2592000, // month (30 days) to second
      year: 31536000  // year (365 days) to second
    },
    speed: {
      mps: 1,         // meters per second (base unit)
      kph: 0.277778,  // kilometers per hour to meters per second
      mph: 0.44704,   // miles per hour to meters per second
      fps: 0.3048,    // feet per second to meters per second
      knot: 0.514444  // knot to meters per second
    },
    data: {
      bit: 0.125e-6,  // bit to megabyte
      byte: 1e-6,     // byte to megabyte
      kb: 0.001,      // kilobyte to megabyte
      mb: 1,          // megabyte (base unit)
      gb: 1000,       // gigabyte to megabyte
      tb: 1000000     // terabyte to megabyte
    }
  },

  /**
   * Convert a value from one unit to another
   * @param {string} category - Conversion category (e.g., 'length', 'mass')
   * @param {string} fromUnit - Source unit
   * @param {string} toUnit - Target unit
   * @param {number} value - Value to convert
   * @returns {number} Converted value
   * @throws {Error} If category or units are invalid
   */
  convert: function(category, fromUnit, toUnit, value) {
    // Validate inputs
    if (!this.conversionRates[category]) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    if (!this.conversionRates[category][fromUnit]) {
      throw new Error(`Invalid source unit: ${fromUnit}`);
    }
    
    if (!this.conversionRates[category][toUnit]) {
      throw new Error(`Invalid target unit: ${toUnit}`);
    }
    
    // Handle temperature conversions specially
    if (category === 'temperature') {
      return this.convertTemperature(fromUnit, toUnit, value);
    }
    
    // For other categories, convert to base unit first, then to target unit
    const valueInBaseUnit = value * this.conversionRates[category][fromUnit];
    return valueInBaseUnit / this.conversionRates[category][toUnit];
  },
  
  /**
   * Convert temperature between different units
   * @param {string} fromUnit - Source temperature unit
   * @param {string} toUnit - Target temperature unit
   * @param {number} value - Temperature value to convert
   * @returns {number} Converted temperature value
   */
  convertTemperature: function(fromUnit, toUnit, value) {
    // Convert to Celsius first (our base unit for temperature)
    let celsius;
    
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        throw new Error(`Invalid temperature unit: ${fromUnit}`);
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        throw new Error(`Invalid temperature unit: ${toUnit}`);
    }
  },
  
  /**
   * Get all available units for a category
   * @param {string} category - Conversion category
   * @returns {string[]} Array of unit names
   * @throws {Error} If category is invalid
   */
  getUnitsForCategory: function(category) {
    if (!this.conversionRates[category]) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    return Object.keys(this.conversionRates[category]);
  },
  
  /**
   * Get all available categories
   * @returns {string[]} Array of category names
   */
  getCategories: function() {
    return Object.keys(this.conversionRates);
  }
};

// Export the module for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = converterCore;
}
