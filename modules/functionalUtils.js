// --- Functional Utilities Module: Higher-Order Functions and Composition ---

/**
 * Functional programming utilities
 * Compose, pipe, curry, and other higher-order functions
 */

// Higher-Order Functions for Composition
export const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);

export const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

export const curry = (fn) => (...args) => 
    args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));

// Curried Functions for Reusability
export const findByProperty = curry((property, value, array) =>
    array.find(item => item[property] === value)
);

export const updateArrayItem = curry((predicate, updater, array) =>
    array.map(item => predicate(item) ? updater(item) : item)
);

export const filterArray = curry((predicate, array) =>
    array.filter(predicate)
);

// Functional helpers
export const identity = (x) => x;
export const constant = (value) => () => value;
export const not = (fn) => (...args) => !fn(...args);
