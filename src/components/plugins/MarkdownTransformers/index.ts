/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextMatchTransformer,
  Transformer,
} from "@lexical/markdown";
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from "@lexical/react/LexicalHorizontalRuleNode";
import { $createTextNode, LexicalNode } from "lexical";

import {
  $createEquationNode,
  $isEquationNode,
  EquationNode,
} from "../../nodes/EquationNode";
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from "../../nodes/ImageNode";
import emojiList from "../../utils/emoji-list";

export const HR: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? "***" : null;
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode();

    // TODO: Get rid of isImport flag
    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line);
    } else {
      parentNode.insertBefore(line);
    }

    line.selectNext();
  },
  type: "element",
};

export const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null;
    }

    return `![${node.getAltText()}](${node.getSrc()})`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode({
      altText,
      maxWidth: 800,
      src,
    });
    textNode.replace(imageNode);
  },
  trigger: ")",
  type: "text-match",
};

export const EMOJI: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /:([a-z0-9_]+):/,
  regExp: /:([a-z0-9_]+):/,
  replace: (textNode, [, name]) => {
    const emoji = emojiList.find((e) => e.aliases.includes(name))?.emoji;
    if (emoji) {
      textNode.replace($createTextNode(emoji));
    }
  },
  trigger: ":",
  type: "text-match",
};

export const EQUATION: TextMatchTransformer = {
  dependencies: [EquationNode],
  export: (node) => {
    if (!$isEquationNode(node)) {
      return null;
    }

    return `$${node.getEquation()}$`;
  },
  importRegExp: /\$([^$]+?)\$/,
  regExp: /\$([^$]+?)\$$/,
  replace: (textNode, match) => {
    const [, equation] = match;
    const equationNode = $createEquationNode(equation, true);
    textNode.replace(equationNode);
  },
  trigger: "$",
  type: "text-match",
};

export const PLAYGROUND_TRANSFORMERS: Array<Transformer> = [
  HR,
  IMAGE,
  EMOJI,
  EQUATION,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];
