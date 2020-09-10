module.exports = {
  processors: [['stylelint-processor-styled-components']],
  extends: [
    'stylelint-config-palantir',
    'stylelint-config-prettier',
    'stylelint-config-styled-components',
    'stylelint-config-idiomatic-order',
  ],
  rules: {
    'selector-max-id': 1,
    'selector-max-universal': 1,
    'order/properties-alphabetical-order': null,
  },
}
