export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Optional, helps Jest handle relative imports cleanly
  },
};
