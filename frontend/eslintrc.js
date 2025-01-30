module.exports = {
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module", // ✅ Ensure ESLint treats frontend files as ES modules
    },
    env: {
      browser: true,
      es6: true,
    },
    extends: ["react-app", "react-app/jest"],
  };
  