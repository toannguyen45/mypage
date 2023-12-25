module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      alias: {
        map: [
          ['@components', './src/components'],
          ['@utils', './src/utils'],
          ['@pages', './src/pages'],
          ['@constants', './src/constants'],
          ['@api', './src/apis'],
          ['@routes', './src/routes'],
          ['@hooks', './src/hooks'],
          ['@redux', './src/redux'],
          // Thêm các alias khác ở đây
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    eqeqeq: 'warn', // yêu cầu sử dụng === và !==
    'no-trailing-spaces': 'warn', // không cho phép dấu cách ở cuối dòng
    'object-curly-spacing': ['warn', 'always'], // yêu cầu hoặc không cho phép dấu cách bên trong dấu ngoặc nhọn
    'arrow-spacing': ['warn', { before: true, after: true }], // yêu cầu hoặc không cho phép dấu cách bên trong dấu ngoặc nhọn
    'no-unused-vars': 'warn', // cảnh báo khi có biến không được sử dụng
    'no-multiple-empty-lines': ['warn', { max: 1 }], // không cho phép nhiều dòng trống liên tiếp
    'react/prop-types': 'off',
  },
}
