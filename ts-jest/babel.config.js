module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    // "@babel/plugin-syntax-dynamic-import", // needed for prod
    "@babel/plugin-transform-runtime",
    "babel-plugin-transform-dynamic-import", // use only for tests
  ],
};
