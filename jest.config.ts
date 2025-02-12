module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // se usar CSS modules
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
