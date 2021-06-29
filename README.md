# markdown-it-amsmath

[![ci-badge]][ci-link]
[![npm-badge]][npm-link]

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin for [amsmath](https://ctan.org/pkg/amsmath) LaTeX environments.

The following "top-level" environments are parsed, with or without (ending `*`) numbering:
`equation`, `multline`, `gather`, `align`, `alignat`, `flalign`, `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix`, `eqnarray`.

(these environments are taken from [amsmath version 2.1](http://anorien.csc.warwick.ac.uk/mirrors/CTAN/macros/latex/required/amsmath/amsldoc.pdf))

Note the `split`, `gathered`, `aligned`, `alignedat` are not parsed, since they should be used within a parent environment.

See <https://executablebooks.github.io/markdown-it-amsmath/> for a demonstration!

## Usage

You should "bring your own" math render, provided as an option to the plugin.
This function should take the string plus (optional) options, and return a string.
For example, below the [KaTeX](https://github.com/Khan/KaTeX) render is used.

As a Node module:

```javascript
import { renderToString } from "katex"
import MarkdownIt from "markdown-it"
import amsmathPlugin from "markdown-it-amsmath"

const mdit = MarkdownIt().use(amsmathPlugin, {
      renderer: renderToString,
      options: { throwOnError: false, displayMode: true }
})
const text = mdit.render("\\begin{equation}a = 1\\end{equation}")
```

In the browser:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Example Page</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/markdown-it@12/dist/markdown-it.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
        <script src="https://unpkg.com/markdown-it-amsmath"></script>
    </head>
    <body>
        <div id="demo"></div>
        <script>
            const options = { renderer: katex.renderToString, options: { throwOnError: false, displayMode: true }};
            const text = window.markdownit().use(window.markdownitAmsmath, options).render("\\begin{equation}a = 1\\end{equation}");
            document.getElementById("demo").innerHTML = text
        </script>
    </body>
</html>
```

## Development

### Features

- TypeScript
- Code Formatting ([prettier])
- Code Linting ([eslint])
- Testing and coverage ([jest])
- Continuous Integration ([GitHub Actions])
- Bundled as both UMD and ESM ([rollup])
- Upload as [NPM] package and [unpkg] CDN
- Simple demonstration website ([GitHub Pages])

### Getting Started

1. Create a GitHub repository [from the template](https://docs.github.com/en/github-ae@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-repository-from-a-template).
2. Replace package details in the following files:
   - `package.json`
   - `LICENSE`
   - `README.md`
   - `rollup.config.js`
3. Install the `node_module` dependencies: `npm install` or `npm ci` (see [Install a project with a clean slate](https://docs.npmjs.com/cli/v7/commands/npm-ci)).
4. Run code formatting; `npm run format`, and linting: `npm run lint:fix`.
5. Run the unit tests; `npm test`, or with coverage; `npm test -- --coverage`.

Now you can start to adapt the code in `src/index.ts` for your plugin, starting with the [markdown-it development recommendations](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md).

Modify the test in `tests/fixtures.spec.ts`, to load your plugin, then the "fixtures" in `tests/fixtures`, to provide a set of potential Markdown inputs and expected HTML outputs.

On commits/PRs to the `master` branch, the GH actions will trigger, running the linting, unit tests, and build tests.
Additionally setup and uncomment the [codecov](https://about.codecov.io/) action in `.github/workflows/ci.yml`, to provide automated CI coverage.

Finally, you can update the version of your package, e.g.: `npm version patch -m "🚀 RELEASE: v%s"`, build; `npm run build`, and publish; `npm publish`.

Finally, you can adapt the HTML document in `docs/`, to load both markdown-it and the plugin (from [unpkg]), then render text from an input area.
This can be deployed by [GitHub Pages].


[ci-badge]: https://github.com/executablebooks/markdown-it-amsmath/workflows/CI/badge.svg
[ci-link]: https://github.com/executablebooks/markdown-it--plugin-template/actions
[npm-badge]: https://img.shields.io/npm/v/markdown-it-amsmath.svg
[npm-link]: https://www.npmjs.com/package/markdown-it-amsmath

[GitHub Actions]: https://docs.github.com/en/actions
[GitHub Pages]: https://docs.github.com/en/pages
[prettier]: https://prettier.io/
[eslint]: https://eslint.org/
[Jest]: https://facebook.github.io/jest/
[Rollup]: https://rollupjs.org
[npm]: https://www.npmjs.com
[unpkg]: https://unpkg.com/
