import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import React, { useEffect, useState, useRef } from "react";

import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import EquationsPlugin from "./plugins/EquationsPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";

import ContentEditable from "./ui/ContentEditable";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { EmojiNode } from "./nodes/EmojiNode";
import { EquationNode } from "./nodes/EquationNode";
import { ImageNode } from "./nodes/ImageNode";
import { YouTubeNode } from "./nodes/YouTubeNode";

const Reader = ({ editorState, ...props }) => {
  return (
    <LexicalComposer
      initialConfig={{
        editable: false,
        editorState: editorState,
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          AutoLinkNode,
          LinkNode,
          ImageNode,
          EmojiNode,
          EquationNode,
          HorizontalRuleNode,
          YouTubeNode,
          MarkNode,
        ],
        onError: (error) => {
          throw error;
        },
      }}
    >
      <div className={`editor-container`}>
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <EmojisPlugin />
        <AutoLinkPlugin />

        <HistoryPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor">
                <ContentEditable />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <AutoFocusPlugin />
        <HistoryPlugin />
        <ImagesPlugin captionsEnabled={false} />
        <LinkPlugin />
        <ClickableLinkPlugin />
        <ImagesPlugin />
        <LinkPlugin />
        <YouTubePlugin />
        <ClickableLinkPlugin />
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <TabFocusPlugin />
        <TabIndentationPlugin />
      </div>
    </LexicalComposer>
  );
};

export default Reader;
