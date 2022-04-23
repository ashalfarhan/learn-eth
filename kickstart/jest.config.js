const nextJest = require('next/jest')({ dir: './' });

/** @type {import("@jest/types").Config.InitialOptions} */
const jestConfig = {};

module.exports = nextJest(jestConfig);
