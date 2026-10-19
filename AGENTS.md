# Agent guidelines

## Coding Standards
*   **Comments only for the truly non-obvious.** The code explains itself through names, constants, types and small functions, so do not describe what it does or why it is shaped the way it is: no prose in JSDoc, no text after `@param`/`@returns`, no notes repeating the code. A comment is warranted only for what the code cannot say and a reader would otherwise get wrong or "simplify" into a bug: a platform or library quirk, a workaround, a constraint imposed from elsewhere (e.g. what the server protocol requires, an event order). Keep it to one short line at the spot it concerns. Tool directives stay (`// eslint-disable-…`, `// @ts-expect-error`, `/// <reference …>`).
