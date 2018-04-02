module.exports = {
  "root": true,
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "rules": {
    "max-len": ["error", 120],
    "no-bitwise": "off",
    "no-cond-assign": "off",
    "no-mixed-operators": "off",
    "no-multi-assign": "off",
    "no-new-func": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off",
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "ignore",
    }],
  }
};
