module.exports = {
  // Основные настройки
  env: {
    node: true, // Глобальные переменные Node.js (module, process, __dirname и т. д.)
    es2021: true, // Современный ES (Promise, async/await, optional chaining и т. д.)
  },
  extends: [
    'eslint:recommended', // Стандартные правила ESLint
    'plugin:@typescript-eslint/recommended', // Рекомендации для TypeScript (если используется)
    'plugin:prettier/recommended', // Интеграция Prettier (должен быть последним!)
  ],
  parser: '@typescript-eslint/parser', // Парсер для TS (если проект на TS)
  parserOptions: {
    ecmaVersion: 2021, // Версия ECMAScript
    sourceType: 'module', // Использование ES-модулей (import/export)
  },
  plugins: ['@typescript-eslint'], // Плагины для TS (если нужно)
  rules: {
    // Основные правила ESLint
    'no-console': 'warn', // Предупреждение при console.log
    'no-unused-vars': 'warn', // Предупреждение при неиспользуемых переменных
    'no-var': 'error', // Запрет var (используйте let/const)
    'prefer-const': 'error', // Предпочитайте const, если переменная не перезаписывается
    eqeqeq: 'error', // Требует === и !== вместо == и !=
    'arrow-body-style': ['error', 'as-needed'], // Упрощение стрелочных функций

    // TypeScript-специфичные правила (если используется)
    '@typescript-eslint/explicit-function-return-type': 'off', // Не требовать явного типа возврата
    '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение при использовании `any`

    // Интеграция с Prettier
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 100,
        endOfLine: 'lf',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'], // Правила для тестов
      env: {
        jest: true, // Глобальные переменные Jest
      },
    },
  ],
};
