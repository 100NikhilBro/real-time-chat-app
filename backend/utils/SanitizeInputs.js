// for sanitizeInput -> used xss

const xss = require('xss');

exports.cleanInput = (obj) => {
    const clean = {};
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            clean[key] = xss(obj[key].trim());
        } else {
            clean[key] = obj[key];
        }
    }
    return clean;
};