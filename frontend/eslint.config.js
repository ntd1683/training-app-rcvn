// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["build","dist","node_modules",".cache",".next","coverage","tests"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      "jsx-a11y/anchor-is-valid": "off",
      "react-hooks/rules-of-hooks": "error", 
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "no-unused-vars": ["error", { "caughtErrors": "none" }],
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],
  },
]);
