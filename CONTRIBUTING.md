# Contributing

Thanks for your interest in the Devana JavaScript SDK!

## Reporting issues

Open an issue at https://github.com/devanachat/devana-js-sdk/issues. For a bug, include the SDK version, your
environment (browser or Node.js version) and the smallest code that reproduces it.

Please report security vulnerabilities privately to kontakt@devana.pl, not in a public issue.

## Development

```sh
git clone https://github.com/devanachat/devana-js-sdk.git
cd devana-js-sdk
npm ci
npm test
npm run build
```

- `src/` - clients, state tracking and permissions
- `src/protocol/` - types of the protocol commands and events; keep them in sync with the server
- `tests/` - Jest tests

Export protocol interfaces from `src/protocol/index.ts` with `export type`, and only runtime values (enums, constants)
with a plain `export` - otherwise bundlers warn about missing exports.

## Pull requests

- Keep a pull request focused on one change and add tests for new behaviour.
- Add an entry to the `Unreleased` section of [CHANGELOG.md](CHANGELOG.md).
- `npm test` and `npm run build` must pass; CI runs both.

## Releasing (maintainers)

1. Move the `Unreleased` changelog entries under the new version and bump `version` in `package.json`.
2. Commit, then tag and push: `git tag v0.6.0 && git push --follow-tags`.
3. Publish a GitHub release for the tag - the `publish` workflow tests, builds and publishes it to npm.

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
