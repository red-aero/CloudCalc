/**
 * Unit Conversion Module
 * Handles unit conversions between different measurement systems
 */
const UnitConverter = {
    // Current state
    currentCategory: 'length',
    fromUnit: '',
    toUnit: '',

    // DOM Elements
    elements: {},

    // Unit definitions for different categories
    units: {
        length: {
            meter: { name: 'Meter (m)', factor: 1 },
            kilometer: { name: 'Kilometer (km)', factor: 1000 },
            centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
            millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
            inch: { name: 'Inch (in)', factor: 0.0254 },
            foot: { name: 'Foot (ft)', factor: 0.3048 },
            yard: { name: 'Yard (yd)', factor: 0.9144 },
            mile: { name: 'Mile (mi)', factor: 1609.344 }
        },
        mass: {
            kilogram: { name: 'Kilogram (kg)', factor: 1 },
            gram: { name: 'Gram (g)', factor: 0.001 },
            milligram: { name: 'Milligram (mg)', factor: 0.000001 },
            pound: { name: 'Pound (lb)', factor: 0.45359237 },
            ounce: { name: 'Ounce (oz)', factor: 0.028349523125 },
            ton: { name: 'Metric Ton (t)', factor: 1000 },
            stone: { name: 'Stone (st)', factor: 6.35029318 }
        },
        temperature: {
            celsius: { name: 'Celsius (°C)', factor: 1, offset: 0 },
            fahrenheit: { name: 'Fahrenheit (°F)', factor: 5/9, offset: -32 * 5/9 },
            kelvin: { name: 'Kelvin (K)', factor: 1, offset: -273.15 }
        },
        area: {
            squareMeter: { name: 'Square Meter (m²)', factor: 1 },
            squareKilometer: { name: 'Square Kilometer (km²)', factor: 1000000 },
            squareCentimeter: { name: 'Square Centimeter (cm²)', factor: 0.0001 },
            squareMillimeter: { name: 'Square Millimeter (mm²)', factor: 0.000001 },
            squareInch: { name: 'Square Inch (in²)', factor: 0.00064516 },
            squareFoot: { name: 'Square Foot (ft²)', factor: 0.09290304 },
            squareYard: { name: 'Square Yard (yd²)', factor: 0.83612736 },
            acre: { name: 'Acre', factor: 4046.8564224 },
            hectare: { name: 'Hectare (ha)', factor: 10000 }
        },
        volume: {
            cubicMeter: { name: 'Cubic Meter (m³)', factor: 1 },
            liter: { name: 'Liter (L)', factor: 0.001 },
            milliliter: { name: 'Milliliter (mL)', factor: 0.000001 },
            gallon: { name: 'Gallon (US)', factor: 0.00378541 },
            quart: { name: 'Quart (US)', factor: 0.000946353 },
            pint: { name: 'Pint (US)', factor: 0.000473176 },
            cup: { name: 'Cup (US)', factor: 0.000236588 },
            fluidOunce: { name: 'Fluid Ounce (US)', factor: 0.0000295735 },
            cubicInch: { name: 'Cubic Inch (in³)', factor: 0.0000163871 },
            cubicFoot: { name: 'Cubic Foot (ft³)', factor: 0.0283168 }
        },
        time: {
            second: { name: 'Second (s)', factor: 1 },
            minute: { name: 'Minute (min)', factor: 60 },
            hour: { name: 'Hour (h)', factor: 3600 },
            day: { name: 'Day (d)', factor: 86400 },
            week: { name: 'Week (wk)', factor: 604800 },
            month: { name: 'Month (avg)', factor: 2629746 },
            year: { name: 'Year (avg)', factor: 31556952 }
        },
        speed: {
            meterPerSecond: { name: 'Meter/Second (m/s)', factor: 1 },
            kilometerPerHour: { name: 'Kilometer/Hour (km/h)', factor: 0.277778 },
            milePerHour: { name: 'Mile/Hour (mph)', factor: 0.44704 },
            knot: { name: 'Knot (kn)', factor: 0.514444 },
            footPerSecond: { name: 'Foot/Second (ft/s)', factor: 0.3048 }
        },
        pressure: {
            pascal: { name: 'Pascal (Pa)', factor: 1 },
            kilopascal: { name: 'Kilopascal (kPa)', factor: 1000 },
            bar: { name: 'Bar', factor: 100000 },
            psi: { name: 'PSI', factor: 6894.76 },
            atmosphere: { name: 'Atmosphere (atm)', factor: 101325 },
            mmHg: { name: 'mmHg', factor: 133.322 }
        },
        energy: {
            joule: { name: 'Joule (J)', factor: 1 },
            kilojoule: { name: 'Kilojoule (kJ)', factor: 1000 },
            calorie: { name: 'Calorie (cal)', factor: 4.184 },
            kilocalorie: { name: 'Kilocalorie (kcal)', factor: 4184 },
            wattHour: { name: 'Watt-hour (Wh)', factor: 3600 },
            kilowattHour: { name: 'Kilowatt-hour (kWh)', factor: 3600000 },
            electronvolt: { name: 'Electronvolt (eV)', factor: 1.602176634e-19 },
            btu: { name: 'BTU', factor: 1055.06 }
        },
        data: {
            bit: { name: 'Bit (b)', factor: 1 },
            byte: { name: 'Byte (B)', factor: 8 },
            kilobit: { name: 'Kilobit (kb)', factor: 1000 },
            kilobyte: { name: 'Kilobyte (KB)', factor: 8000 },
            megabit: { name: 'Megabit (Mb)', factor: 1000000 },
            megabyte: { name: 'Megabyte (MB)', factor: 8000000 },
            gigabit: { name: 'Gigabit (Gb)', factor: 1000000000 },
            gigabyte: { name: 'Gigabyte (GB)', factor: 8000000000 },
            terabit: { name: 'Terabit (Tb)', factor: 1000000000000 },
            terabyte: { name: 'Terabyte (TB)', factor: 8000000000000 }
        }
    },

    // Initialize the converter
    init() {
        // Initialize DOM elements
        this.elements = {
            categorySelect: document.getElementById('conversion_category'),
            fromValueInput: document.getElementById('conversion_from_value'),
            fromUnitSelect: document.getElementById('conversion_from_unit'),
            toValueInput: document.getElementById('conversion_to_value'),
            toUnitSelect: document.getElementById('conversion_to_unit'),
            swapButton: document.getElementById('conversion_swap'),
            clearButton: document.getElementById('conversion_clear')
        };

        // Add event listeners
        this.elements.categorySelect.addEventListener('change', this.handleCategoryChange.bind(this));
        this.elements.fromValueInput.addEventListener('input', this.handleValueChange.bind(this));
        this.elements.fromValueInput.addEventListener('keydown', this.handleInputKeydown.bind(this));
        this.elements.fromUnitSelect.addEventListener('change', this.handleUnitChange.bind(this));
        this.elements.toUnitSelect.addEventListener('change', this.handleUnitChange.bind(this));
        this.elements.swapButton.addEventListener('click', this.handleSwap.bind(this));
        this.elements.clearButton.addEventListener('click', this.handleClear.bind(this));

        // Initialize with default category
        this.populateUnitSelects(this.currentCategory);
        this.setDefaultUnits(this.currentCategory);
        this.convert();
    },

    // Populate unit select dropdowns based on category
    populateUnitSelects(category) {
        // Clear existing options
        this.elements.fromUnitSelect.innerHTML = '';
        this.elements.toUnitSelect.innerHTML = '';

        // Get units for the selected category
        const units = this.units[category];

        // Add options to selects
        for (const [key, unit] of Object.entries(units)) {
            const fromOption = document.createElement('option');
            fromOption.value = key;
            fromOption.textContent = unit.name;
            this.elements.fromUnitSelect.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = key;
            toOption.textContent = unit.name;
            this.elements.toUnitSelect.appendChild(toOption);
        }
    },

    // Set default units for a category
    setDefaultUnits(category) {
        switch (category) {
            case 'length':
                this.elements.fromUnitSelect.value = 'meter';
                this.elements.toUnitSelect.value = 'kilometer';
                break;
            case 'mass':
                this.elements.fromUnitSelect.value = 'kilogram';
                this.elements.toUnitSelect.value = 'gram';
                break;
            case 'temperature':
                this.elements.fromUnitSelect.value = 'celsius';
                this.elements.toUnitSelect.value = 'fahrenheit';
                break;
            case 'area':
                this.elements.fromUnitSelect.value = 'squareMeter';
                this.elements.toUnitSelect.value = 'squareFoot';
                break;
            case 'volume':
                this.elements.fromUnitSelect.value = 'liter';
                this.elements.toUnitSelect.value = 'gallon';
                break;
            case 'time':
                this.elements.fromUnitSelect.value = 'second';
                this.elements.toUnitSelect.value = 'minute';
                break;
            case 'speed':
                this.elements.fromUnitSelect.value = 'kilometerPerHour';
                this.elements.toUnitSelect.value = 'milePerHour';
                break;
            case 'pressure':
                this.elements.fromUnitSelect.value = 'pascal';
                this.elements.toUnitSelect.value = 'bar';
                break;
            case 'energy':
                this.elements.fromUnitSelect.value = 'joule';
                this.elements.toUnitSelect.value = 'calorie';
                break;
            case 'data':
                this.elements.fromUnitSelect.value = 'byte';
                this.elements.toUnitSelect.value = 'kilobyte';
                break;
            default:
                // Use first two units as default
                const unitKeys = Object.keys(this.units[category]);
                if (unitKeys.length >= 2) {
                    this.elements.fromUnitSelect.value = unitKeys[0];
                    this.elements.toUnitSelect.value = unitKeys[1];
                }
        }

        this.fromUnit = this.elements.fromUnitSelect.value;
        this.toUnit = this.elements.toUnitSelect.value;
    },

    // Convert between units
    async convert() {
        const fromValue = parseFloat(this.elements.fromValueInput.value);
        if (isNaN(fromValue)) {
            this.elements.toValueInput.value = '';
            return;
        }

        const category = this.currentCategory;
        const fromUnit = this.fromUnit;
        const toUnit = this.toUnit;

        try {
            // Use the API for conversion if available
            if (typeof API !== 'undefined' && API.conversion && API.conversion.convert) {
                const result = await API.conversion.convert(category, fromUnit, toUnit, fromValue);
                this.elements.toValueInput.value = this.formatResult(result);
            } else {
                // Fallback to local conversion
                this.convertLocally(fromValue, category, fromUnit, toUnit);
            }
        } catch (error) {
            console.error('Error during conversion:', error);

            // Fallback to local conversion if API fails
            this.convertLocally(fromValue, category, fromUnit, toUnit);
        }
    },

    // Local conversion as fallback
    convertLocally(fromValue, category, fromUnit, toUnit) {
        // Special case for temperature
        if (category === 'temperature') {
            let celsius;

            // Convert from unit to Celsius
            if (fromUnit === 'celsius') {
                celsius = fromValue;
            } else if (fromUnit === 'fahrenheit') {
                celsius = (fromValue - 32) * 5/9;
            } else if (fromUnit === 'kelvin') {
                celsius = fromValue - 273.15;
            }

            // Convert from Celsius to target unit
            let result;
            if (toUnit === 'celsius') {
                result = celsius;
            } else if (toUnit === 'fahrenheit') {
                result = celsius * 9/5 + 32;
            } else if (toUnit === 'kelvin') {
                result = celsius + 273.15;
            }

            this.elements.toValueInput.value = this.formatResult(result);
            return;
        }

        // For other unit types, use conversion factors
        const fromFactor = this.units[category][fromUnit].factor;
        const toFactor = this.units[category][toUnit].factor;

        // Convert to base unit, then to target unit
        const baseValue = fromValue * fromFactor;
        const result = baseValue / toFactor;

        this.elements.toValueInput.value = this.formatResult(result);
    },

    // Format the result to a reasonable number of decimal places
    formatResult(value) {
        if (Math.abs(value) < 0.000001 || Math.abs(value) >= 1000000) {
            return value.toExponential(6);
        }

        // Determine number of decimal places based on value
        let decimalPlaces = 6;
        if (Math.abs(value) >= 100) decimalPlaces = 2;
        else if (Math.abs(value) >= 10) decimalPlaces = 3;
        else if (Math.abs(value) >= 1) decimalPlaces = 4;
        else if (Math.abs(value) >= 0.1) decimalPlaces = 5;

        return value.toFixed(decimalPlaces).replace(/\.?0+$/, '');
    },

    // Event Handlers
    handleCategoryChange(event) {
        this.currentCategory = event.target.value;
        this.populateUnitSelects(this.currentCategory);
        this.setDefaultUnits(this.currentCategory);
        this.convert();
    },

    handleValueChange() {
        this.convert();
    },

    handleUnitChange() {
        this.fromUnit = this.elements.fromUnitSelect.value;
        this.toUnit = this.elements.toUnitSelect.value;
        this.convert();
    },

    handleSwap() {
        // Swap units
        const tempUnit = this.fromUnit;
        this.fromUnit = this.toUnit;
        this.toUnit = tempUnit;

        // Update UI
        this.elements.fromUnitSelect.value = this.fromUnit;
        this.elements.toUnitSelect.value = this.toUnit;

        // Swap values if the to value is not empty
        if (this.elements.toValueInput.value) {
            const tempValue = this.elements.fromValueInput.value;
            this.elements.fromValueInput.value = this.elements.toValueInput.value;
            this.elements.toValueInput.value = tempValue;
        }

        // Convert with new settings
        this.convert();
    },

    handleClear() {
        this.elements.fromValueInput.value = '1';
        this.convert();
    },

    // Handle keydown events in the input field
    handleInputKeydown(event) {
        // If Enter key is pressed, perform conversion
        if (event.key === 'Enter') {
            event.preventDefault();
            this.convert();
            // Blur the input to hide mobile keyboard
            this.elements.fromValueInput.blur();
        }
    }
};