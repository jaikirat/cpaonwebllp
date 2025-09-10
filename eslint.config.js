import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript"
  ),
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description", 
          "ts-nocheck": "allow-with-description",
          "ts-check": false,
          minimumDescriptionLength: 3,
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external", 
            "internal",
            ["parent", "sibling"],
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error",

      // React and Next.js specific rules
      "react/prop-types": "off", // TypeScript handles this
      "react/react-in-jsx-scope": "off", // Next.js auto-imports React
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-redundant-roles": "error",

      // General code quality rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "object-shorthand": "error",
      "array-callback-return": "error",
      "consistent-return": "error",
      "default-case": "error",
      eqeqeq: ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-loop-func": "error",
      "no-new-wrappers": "error",
      "no-proto": "error",
      "no-return-assign": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-unneeded-ternary": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      radix: "error",
      yoda: "error",

      // Style and formatting rules
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": ["error", { before: false, after: true }],
      "comma-style": ["error", "last"],
      "computed-property-spacing": ["error", "never"],
      "func-call-spacing": ["error", "never"],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      "object-curly-spacing": ["error", "always"],
      quotes: ["error", "single", { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "semi-spacing": ["error", { before: false, after: true }],
      "space-before-blocks": ["error", "always"],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", { words: true, nonwords: false }],
      "spaced-comment": ["error", "always", { exceptions: ["-", "="] }],
    },
  },
];

export default eslintConfig;