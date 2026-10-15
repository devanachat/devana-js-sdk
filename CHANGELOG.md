# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[semver](https://semver.org) (`0.x` minor releases may break the API).

## [0.6.0] - Unreleased

The first release under the new name. Earlier versions were published as `polfan-server-js-client`.

### Changed

- **Renamed the package to `@devanachat/sdk`** and moved the repository to
  [devanachat/devana-js-sdk](https://github.com/devanachat/devana-js-sdk).
  To keep existing imports while migrating, install it under an alias:
  `npm install polfan-server-js-client@npm:@devanachat/sdk`.
- The UMD build exposes the global `Devana` (previously `PservClient`).
- The protocol types (formerly the `pserv-ts-types` git submodule) are now part of this repository, under
  `src/protocol`.
- Bundlers resolve the new ES module build instead of the UMD one. The output targets modern browsers and
  Node.js 22+, which makes the bundles about three times smaller.

- `send()` resolves to a discriminated union, `{data, error: null} | {data: null, error}`: after checking `error`,
  TypeScript knows that `data` is set.
- Event handlers receive a non-optional payload (`(ev: T) => void`), so destructuring it compiles in strict mode.

### Added

- ES module build (`build/index.mjs`).
- Type exports from the package root: `CommandResult`, `CommandRequest`, `CommandResponse`, `CommandsMap`,
  `EventsMap`, client option types, `EventHandler` and `ObservableInterface` - no more deep imports from `build/`.

### Fixed

- Bundlers no longer report missing re-exports for the protocol types.
- The npm package contains only the build output (it used to include sources and tests).
- `terser-webpack-plugin` is no longer installed as a runtime dependency.
