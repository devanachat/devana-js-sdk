# AGENTS.md

Instructions for coding agents working on `@devanachat/sdk`. For the project layout and the general contribution rules,
see [CONTRIBUTING.md](CONTRIBUTING.md); this file adds what an agent would otherwise get wrong.

## Commands

- `npm ci` - install dependencies
- `npm test` - Jest tests
- `npm run build` - webpack bundles and type declarations in `build/`

Both `npm test` and `npm run build` must pass before a change is done.

## Changes and the changelog

- Every user-facing change gets an entry in the `## [Unreleased]` section at the top of [CHANGELOG.md](CHANGELOG.md),
  under the matching Keep a Changelog heading (`Added`, `Changed`, `Fixed`, ...). Create the section if it is missing.
- Describe the behaviour a consumer of the SDK sees, not the implementation. Link the upstream issue when a fix works
  around a bug in a third-party tool.
- A released version has a plain header: `## [0.8.1]`, never `## [0.8.1] - Unreleased`.

## Versions and releases

- Do not bump `version` in `package.json` / `package-lock.json`, move changelog entries under a version, or tag a
  release as part of a change. Several changes go into one release, and releasing is a separate step done by the
  maintainer (see "Releasing" in CONTRIBUTING.md).

## Git

- Commit with the identity configured in the repository. Do not set another author and do not add `Co-Authored-By`
  or other attribution trailers.
- Keep each commit to one logical change; changelog-only edits may go into a commit of their own.

## Comments

- **Comments only for the truly non-obvious.** The code explains itself through names, constants, types and small
  functions, so do not describe what it does or why it is shaped the way it is: no notes repeating the code, no text
  after `@param`/`@returns` types. A comment is warranted only for what the code cannot say and a reader would
  otherwise get wrong or "simplify" into a bug: a platform or library quirk, a workaround, a constraint imposed from
  elsewhere (e.g. a protocol or server limitation, a consumer's toolchain). Keep it to one short line at the spot it
  concerns.
- The exception is the public API: a JSDoc on an exported type, field or method ships in the type declarations and
  is what a consumer reads in the editor. Keep one there only for what the type does not say - what `null` or an
  absent field means, units, limits, ordering - in a sentence or two. Internal code follows the rule above.

## Code that survives consumers' toolchains

The build is re-transpiled by the bundlers of the applications using it (e.g. `babel-preset-expo`, which enables
Babel's loose mode for web targets). Avoid syntax whose meaning depends on transform options:

- To omit a key from an object, copy it and `delete` the key. Do not use rest destructuring with a computed key and an
  unused binding (`const {[key]: _, ...rest} = obj`) - loose object rest keeps the key (babel/babel#18196).

When a bug shows up only in one consumer platform while the SDK logic looks right, transpile `build/` with that
consumer's toolchain and run the result in Node to reproduce it, before changing the SDK.
