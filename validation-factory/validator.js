const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneWithDashes: /^\d{3}-\d{3}-\d{4}$/,
    numbersOnly: /^\d+$/,
    lettersOnly: /^[a-zA-Z]+$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    zipcode: /^\d{5}(-\d{4})?$/,
};

const validators = {
    // Add more? :/
    email: (input) => patterns.email.test(input) ? true : "Invalid email format",
    phoneWithDashes: (input) => patterns.phoneWithDashes.test(input) ? true : "Invalid phone format",
    zipCode: (input) => patterns.zipcode.test(input) ? true : "Invalid zipcode format"
}

function createValidator(validators) {
    return function(...args) {
        const errors = []
        const input = args[0]

        if (input === null || input === undefined) {
            return {
                isValid: false,
                errors: ["Values null and undefined are invalid"]
            }
        }

        for (const validator of validators) {
            const res = validator(input)
            if (res !== true) {
                errors.push(res)
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        }
    }
}

module.exports = { createValidator, validators }
