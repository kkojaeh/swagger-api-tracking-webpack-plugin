module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/index.ts"],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "ts", "json"],
  testEnvironment: "node"
};
