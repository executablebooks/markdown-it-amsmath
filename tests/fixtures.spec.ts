import { describe, expect, it } from "vitest"
import fs from "node:fs"
import katex from "katex"
import MarkdownIt from "markdown-it"
import amsmathPlugin from "../src"

/** Read a "fixtures" file, containing a set of tests:
 *
 * test name
 * .
 * input text
 * .
 * expected output
 * .
 *
 * */
function readFixtures(name: string): string[][] {
  const fixtures = fs.readFileSync(`tests/fixtures/${name}.md`).toString()
  return fixtures.split("\n.\n\n").map(s => s.split("\n.\n"))
}

describe("Parses basic", () => {
  readFixtures("basic").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(amsmathPlugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual(expected.trim()))
  })

  readFixtures("katex").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(amsmathPlugin, {
      renderer: math =>
        katex.renderToString(math, { throwOnError: false, displayMode: true })
    })
    let rendered = mdit.render(text)
    // remove styles
    rendered = rendered.replace(/style="[^"]+"/g, 'style=""')
    it(name, () => expect(rendered.trim()).toEqual(expected.trim()))
  })
})
