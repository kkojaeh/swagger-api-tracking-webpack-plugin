module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/index.ts"],
  coverageDirectory: "coverage",
  modulePathIgnorePatterns: ['ui'],
  moduleFileExtensions: ["js", "ts", "json"],
  testEnvironment: "node",
  "globals": {
    "ts-jest": {
      "diagnostics": true
    }
  }
};
