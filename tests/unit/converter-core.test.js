/**
 * Unit tests for the converter core module
 */

// Import the converter core module
const converterCore = require('../../assets/js/converter-core.js');

// Length conversion tests
describe('Length Conversions', () => {
  test('converts 1 meter to 100 centimeters', () => {
    expect(converterCore.convert('length', 'm', 'cm', 1)).toBe(100);
  });

  test('converts 1 kilometer to 1000 meters', () => {
    expect(converterCore.convert('length', 'km', 'm', 1)).toBe(1000);
  });

  test('converts 1 foot to 12 inches', () => {
    expect(converterCore.convert('length', 'foot', 'inch', 1)).toBeCloseTo(12, 5);
  });

  test('converts 1 mile to 1.60934 kilometers', () => {
    expect(converterCore.convert('length', 'mile', 'km', 1)).toBeCloseTo(1.60934, 5);
  });

  test('converts 100 centimeters to 1 meter', () => {
    expect(converterCore.convert('length', 'cm', 'm', 100)).toBe(1);
  });
});

// Mass conversion tests
describe('Mass Conversions', () => {
  test('converts 1 kilogram to 1000 grams', () => {
    expect(converterCore.convert('mass', 'kg', 'g', 1)).toBe(1000);
  });

  test('converts 1 pound to 16 ounces', () => {
    expect(converterCore.convert('mass', 'lb', 'oz', 1)).toBeCloseTo(16, 1);
  });

  test('converts 1 ton to 1000 kilograms', () => {
    expect(converterCore.convert('mass', 'ton', 'kg', 1)).toBe(1000);
  });

  test('converts 1000 grams to 1 kilogram', () => {
    expect(converterCore.convert('mass', 'g', 'kg', 1000)).toBe(1);
  });
});

// Temperature conversion tests
describe('Temperature Conversions', () => {
  test('converts 0°C to 32°F', () => {
    expect(converterCore.convert('temperature', 'celsius', 'fahrenheit', 0)).toBe(32);
  });

  test('converts 100°C to 212°F', () => {
    expect(converterCore.convert('temperature', 'celsius', 'fahrenheit', 100)).toBe(212);
  });

  test('converts 0°C to 273.15K', () => {
    expect(converterCore.convert('temperature', 'celsius', 'kelvin', 0)).toBe(273.15);
  });

  test('converts 32°F to 0°C', () => {
    expect(converterCore.convert('temperature', 'fahrenheit', 'celsius', 32)).toBeCloseTo(0, 10);
  });

  test('converts 212°F to 100°C', () => {
    expect(converterCore.convert('temperature', 'fahrenheit', 'celsius', 212)).toBeCloseTo(100, 10);
  });

  test('converts 273.15K to 0°C', () => {
    expect(converterCore.convert('temperature', 'kelvin', 'celsius', 273.15)).toBeCloseTo(0, 10);
  });
});

// Area conversion tests
describe('Area Conversions', () => {
  test('converts 1 square meter to 10000 square centimeters', () => {
    expect(converterCore.convert('area', 'm2', 'cm2', 1)).toBe(10000);
  });

  test('converts 1 hectare to 10000 square meters', () => {
    expect(converterCore.convert('area', 'ha', 'm2', 1)).toBe(10000);
  });

  test('converts 1 square kilometer to 100 hectares', () => {
    expect(converterCore.convert('area', 'km2', 'ha', 1)).toBe(100);
  });

  test('converts 1 acre to 4046.86 square meters', () => {
    expect(converterCore.convert('area', 'acre', 'm2', 1)).toBeCloseTo(4046.86, 2);
  });
});

// Volume conversion tests
describe('Volume Conversions', () => {
  test('converts 1 liter to 1000 milliliters', () => {
    expect(converterCore.convert('volume', 'l', 'ml', 1)).toBeCloseTo(1000, 5);
  });

  test('converts 1 cubic meter to 1000 liters', () => {
    expect(converterCore.convert('volume', 'm3', 'l', 1)).toBe(1000);
  });

  test('converts 1 gallon to 3.78541 liters', () => {
    expect(converterCore.convert('volume', 'gal', 'l', 1)).toBeCloseTo(3.78541, 5);
  });

  test('converts 1 gallon to 4 quarts', () => {
    expect(converterCore.convert('volume', 'gal', 'qt', 1)).toBeCloseTo(4, 5);
  });
});

// Time conversion tests
describe('Time Conversions', () => {
  test('converts 1 minute to 60 seconds', () => {
    expect(converterCore.convert('time', 'min', 's', 1)).toBe(60);
  });

  test('converts 1 hour to 60 minutes', () => {
    expect(converterCore.convert('time', 'h', 'min', 1)).toBe(60);
  });

  test('converts 1 day to 24 hours', () => {
    expect(converterCore.convert('time', 'day', 'h', 1)).toBe(24);
  });

  test('converts 1 week to 7 days', () => {
    expect(converterCore.convert('time', 'week', 'day', 1)).toBe(7);
  });
});

// Speed conversion tests
describe('Speed Conversions', () => {
  test('converts 1 meter per second to 3.6 kilometers per hour', () => {
    expect(converterCore.convert('speed', 'mps', 'kph', 1)).toBeCloseTo(3.6, 5);
  });

  test('converts 1 kilometer per hour to 0.621371 miles per hour', () => {
    expect(converterCore.convert('speed', 'kph', 'mph', 1)).toBeCloseTo(0.621371, 5);
  });

  test('converts 1 knot to 1.852 kilometers per hour', () => {
    expect(converterCore.convert('speed', 'knot', 'kph', 1)).toBeCloseTo(1.852, 5);
  });
});

// Data conversion tests
describe('Data Conversions', () => {
  test('converts 1 megabyte to 1000 kilobytes', () => {
    expect(converterCore.convert('data', 'mb', 'kb', 1)).toBe(1000);
  });

  test('converts 1 gigabyte to 1000 megabytes', () => {
    expect(converterCore.convert('data', 'gb', 'mb', 1)).toBe(1000);
  });

  test('converts 1 terabyte to 1000 gigabytes', () => {
    expect(converterCore.convert('data', 'tb', 'gb', 1)).toBe(1000);
  });

  test('converts 1 byte to 8 bits', () => {
    expect(converterCore.convert('data', 'byte', 'bit', 1)).toBe(8);
  });
});

// Error handling tests
describe('Error Handling', () => {
  test('throws error for invalid category', () => {
    expect(() => converterCore.convert('invalid', 'm', 'cm', 1)).toThrow('Invalid category');
  });

  test('throws error for invalid source unit', () => {
    expect(() => converterCore.convert('length', 'invalid', 'cm', 1)).toThrow('Invalid source unit');
  });

  test('throws error for invalid target unit', () => {
    expect(() => converterCore.convert('length', 'm', 'invalid', 1)).toThrow('Invalid target unit');
  });
});

// Utility function tests
describe('Utility Functions', () => {
  test('getCategories returns all available categories', () => {
    const categories = converterCore.getCategories();
    expect(categories).toContain('length');
    expect(categories).toContain('mass');
    expect(categories).toContain('temperature');
    expect(categories).toContain('area');
    expect(categories).toContain('volume');
    expect(categories).toContain('time');
    expect(categories).toContain('speed');
    expect(categories).toContain('data');
  });

  test('getUnitsForCategory returns all units for a category', () => {
    const lengthUnits = converterCore.getUnitsForCategory('length');
    expect(lengthUnits).toContain('m');
    expect(lengthUnits).toContain('cm');
    expect(lengthUnits).toContain('km');
    expect(lengthUnits).toContain('inch');
    expect(lengthUnits).toContain('foot');
    expect(lengthUnits).toContain('mile');
  });

  test('throws error for invalid category in getUnitsForCategory', () => {
    expect(() => converterCore.getUnitsForCategory('invalid')).toThrow('Invalid category');
  });
});
