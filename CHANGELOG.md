## CHANGELOG

### 2.0.1

#### Added

- Created Github Actions workflows to test, release, and deploy docker images to Docker Hub for beta and master.

### 2.0.0

#### Breaking Changes

- Implement new designs provided by Amigos
- Replace css with `theme-ui`. Ignore the foreground and background color from the Circulation Manager. Theming functionality will be added back soon.
- Remove OAuth support. This will be added back soon along with SAML.
- Moved the docker files directly in to the repository root.

#### Internal changes

- Decoupled the app from `opds-web-client`. We now import select functionality but essentially render our own app instead of passing custom components in to the `opds-web-client` app.
- Refactored server code and added `webpack-dev-middleware` to enable hot reloading in development.
- Upgraded to stable React context API.
- Switched from Tslint to Eslint. (Tslint is deprecated)
- Upgraded to React Router v4.
- Installed Prettier to automatically format code uniformly before it reaches source control.
- Removed the second redux instance. We used to use a second redux instance for recommendations state and complaints state. Refactored out local redux to use react's `useReducer` and context instead.
- Turned on typescript's [strictNullChecks](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#--strictnullchecks).
- Added `react-axe` for accessibility warnings in development.
- Created numerous hooks that allow re-use of various functionality like auth, linking, etc.
- Switched to Jest and React Testing Library for testing. Legacy test suites are still run with Enzyme.
- Added [Reakit](https://reakit.io/) as an accessible UI component library.

### 1.0.0

#### Updated

- Updated opds-web-client and Typescript to more recent versions.
- Changed the download buttons to remove duplicate mime types and hide unknown mime types.

#### Added

- The application has a docker submodule and Docker images are now automatically built in Docker hub.

### 0.2.2

#### Updated

- Updated documentation explaining how to run the application. Added a separate LICENSE file.

### 0.2.1

#### Added

- `tslint-react-a11y` to review accessibility for React components.

### 0.2.0

#### Updated

- Updating to React 16.

### 0.1.0

#### Updated

- Updated packages include Webpack and Typescript.
- Using `@types` instead of typings.
- Updated unit tests with updated `fetch-mock` package.
