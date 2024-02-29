type Grammar = import('@wooorm/starry-night').Grammar

type ElementContent = import('hast').ElementContent

type Root = import('hast').Root

interface Options {
  grammars?: Array<Grammar> | null | undefined
}

import {common, createStarryNight} from '@wooorm/starry-night'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'

/**
 * Highlight code with `starry-night`.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeStarryNight(options: Options | null | undefined) {
  const settings = options || {}
  const grammars = settings.grammars || common
  const starryNightPromise = createStarryNight(grammars)
  const prefix = 'language-'

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  return async function (tree: Root): Promise<undefined> {
    const starryNight = await starryNightPromise

    visit(tree, 'element', function (node, index, parent) {
      if (!parent || index === undefined || node.tagName !== 'pre') {
        return
      }

      const head = node.children[0]

      if (!head || head.type !== 'element' || head.tagName !== 'code') {
        return
      }

      const classes = head.properties.className

      if (!Array.isArray(classes)) return

      const language = classes.find(function (d) {
        return typeof d === 'string' && d.startsWith(prefix)
      })

      if (typeof language !== 'string') return

      const scope = starryNight.flagToScope(language.slice(prefix.length))

      // Maybe warn?
      if (!scope) return

      const fragment = starryNight.highlight(toString(head), scope)
      const children = (fragment.children) as Array<ElementContent>

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'highlight',
            'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-')
          ]
        },
        children: [{type: 'element', tagName: 'pre', properties: {}, children}]
      })
    })
  }
}