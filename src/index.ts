/* eslint-disable @typescript-eslint/no-explicit-any */
import type MarkdownIt from "markdown-it/lib/index.js"
import type StateBlock from "markdown-it/lib/rules_block/state_block.js"

export interface IOptions {
  // the render function to use
  renderer?: (content: string) => string
}

/**
 * An markdown-it plugin that parses bare LaTeX [amsmath](https://ctan.org/pkg/amsmath) environments.
 *
 * ```latex
 * \begin{gather*}
 *   a_1=b_1+c_1\\
 *   a_2=b_2+c_2-d_2+e_2
 * \end{gather*}
 * ```
 *
 */
export function amsmathPlugin(md: MarkdownIt, options?: IOptions): void {
  md.block.ruler.before("blockquote", "amsmath", amsmathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  })

  const renderer = options?.renderer

  if (renderer) {
    md.renderer.rules["amsmath"] = (tokens, idx) => {
      const content = tokens[idx].content
      let res: string
      try {
        res = renderer(content)
      } catch (err) {
        res = md.utils.escapeHtml(`${content}:${(err as Error).message}`)
      }
      return res
    }
  } else {
    // basic renderer for testing
    md.renderer.rules["amsmath"] = (tokens, idx) => {
      const content = md.utils.escapeHtml(tokens[idx].content)
      return `<div class="math amsmath">\n${content}\n</div>\n`
    }
  }
}

// Exporting both a default and named export is necessary for Jest in some cases
export default amsmathPlugin

// Taken from amsmath version 2.1
// http://anorien.csc.warwick.ac.uk/mirrors/CTAN/macros/latex/required/amsmath/amsldoc.pdf
const ENVIRONMENTS = [
  // 3.2 single equation with an automatically generated number
  "equation",
  // 3.3 variation equation, used for equations that don’t fit on a single line
  "multline",
  // 3.5 a group of consecutive equations when there is no alignment desired among them
  "gather",
  // 3.6 Used for two or more equations when vertical alignment is desired
  "align",
  // allows the horizontal space between equations to be explicitly specified.
  "alignat",
  // stretches the space between the equation columns to the maximum possible width
  "flalign",
  // 4.1 The pmatrix, bmatrix, Bmatrix, vmatrix and Vmatrix have (respectively)
  // (),[],{},||,and ‖‖ delimiters built in.
  "matrix",
  "pmatrix",
  "bmatrix",
  "Bmatrix",
  "vmatrix",
  "Vmatrix",
  // eqnarray is another math environment, it is not part of amsmath,
  // and note that it is better to use align or equation+split instead
  "eqnarray"
]
// other "non-top-level" environments:

// 3.4 the split environment is for single equations that are too long to fit on one line
// and hence must be split into multiple lines,
// it is intended for use only inside some other displayed equation structure,
// usually an equation, align, or gather environment

// 3.7 variants gathered, aligned,and alignedat are provided
// whose total width is the actual width of the contents;
// thus they can be used as a component in a containing expression

const RE_OPEN = new RegExp(`^\\\\begin{(${ENVIRONMENTS.join("|")})([*]?)}`)

function matchEnvironment(string: string) {
  const matchOpen = string.match(RE_OPEN)
  if (!matchOpen) return null
  const [, environment, numbered] = matchOpen
  const end = `\\end{${environment}${numbered}}`
  const matchClose = string.indexOf(end)
  if (matchClose === -1) return null
  return { environment, numbered, endpos: matchClose + end.length }
}

function amsmathBlock(
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean
) {
  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) return false

  const begin = state.bMarks[startLine] + state.tShift[startLine]

  const outcome = matchEnvironment(state.src.slice(begin))
  if (!outcome) return false
  const { environment, numbered } = outcome
  let { endpos } = outcome
  endpos += begin

  let line = startLine
  while (line < endLine) {
    if (endpos >= state.bMarks[line] && endpos <= state.eMarks[line]) {
      // line for end of block math found ...
      // eslint-disable-next-line no-param-reassign
      state.line = line + 1
      break
    }
    line += 1
  }

  if (!silent) {
    const token = state.push("amsmath", "math", 0)
    token.block = true
    token.content = state.src.slice(begin, endpos)
    token.meta = { environment, numbered }
    token.map = [startLine, line]
  }

  return true
}
