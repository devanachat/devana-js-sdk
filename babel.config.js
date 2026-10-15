module.exports = {
  presets: [
    ["@babel/preset-env", {targets: "defaults and fully supports es6-module, node >= 22"}],
    ["@babel/preset-typescript", {allowDeclareFields: true}],
  ],
};
