# vue-component-library

Library for shared components

## Contents

CbApplet

- Exports `CbApplet`, `CbAppletTarget`, `TheCbAppletStyles`, and `useAppletsStore`
- Currently not importing the /styles.css from the build as it is only Vuetify formatting for the icon

CbAlert

- Exports `useAlertStore`
- TODO: Move the rest of the CbAlert component over

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Scripts

- Start up the repo

```sh
npm install
```

- Compile and Hot-Reload for Development

```sh
npm run dev
```

- Compile and Minify for Production

```sh
npm run build
```

- Run Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```

- Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

- Check [Vitest coverage](https://vitest.dev/guide/coverage.html) with [istanbul](https://www.npmjs.com/package/@vitest/coverage-istanbul)

```sh
npm run coverage
```

### Future Improvments

- CbApplets
  - Re-integrate use of the theme store
