/**
 * Shared validation utilities for HopiSuerte authentication forms.
 */

/**
 * Validates an email address and returns an error message if invalid.
 * @param {string} email
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

/**
 * Password strength rules with labels and test functions.
 */
export const passwordRules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8, message: 'Password must be at least 8 characters long.' },
    { label: '1 lowercase letter', test: (p) => /[a-z]/.test(p), message: 'Password must contain at least one lowercase letter.' },
    { label: '1 uppercase letter', test: (p) => /[A-Z]/.test(p), message: 'Password must contain at least one uppercase letter.' },
    { label: '1 number', test: (p) => /[0-9]/.test(p), message: 'Password must contain at least one number.' },
    { label: '1 special character', test: (p) => /[@$!%*?&#^()_+\-=]/.test(p), message: 'Password must contain at least one special character.' },
];

/**
 * Validates a password against all strength rules.
 * @param {string} password
 * @returns {string} First failing rule's message, or empty string if all pass.
 */
export function validatePassword(password) {
    if (!password || password.trim() === '') {
        return 'Please enter your password.';
    }
    if (password.length > 255) {
        return 'Password must not exceed 255 characters.';
    }
    for (const rule of passwordRules) {
        if (!rule.test(password)) {
            return rule.message;
        }
    }
    return '';
}

/**
 * Checks if all password rules pass.
 * @param {string} password
 * @returns {boolean}
 */
export function allPasswordRulesPassed(password) {
    return password.length > 0 && password.length <= 255 && passwordRules.every(r => r.test(password));
}
