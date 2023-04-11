import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import * as React from "react";
import { useEffect, useState } from "react";

import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import TableCellNodes from "./nodes/TableCellNodes";
import AutocompletePlugin from "./plugins/AutocompletePlugin";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import CollapsiblePlugin from "./plugins/CollapsiblePlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import EquationsPlugin from "./plugins/EquationsPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "./plugins/MaxLengthPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";
import PollPlugin from "./plugins/PollPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import { TablePlugin as NewTablePlugin } from "./plugins/TablePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";

export default function Editor() {
  const text = "Enter some text...";
  const placeholder = <Placeholder>{text}</Placeholder>;

  const cellEditorConfig = {
    namespace: "EditorFull",
    nodes: [...TableCellNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <>
      {<ToolbarPlugin />}
      <div className={`editor-container`}>
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor">
                <ContentEditable />
              </div>
            </div>
          }
          placeholder={placeholder}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <TablePlugin />
        <TableCellResizer />
        <NewTablePlugin cellEditorConfig={cellEditorConfig}>
          <AutoFocusPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="TableNode__contentEditable" />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MentionsPlugin />
          <HistoryPlugin />
          <ImagesPlugin captionsEnabled={false} />
          <LinkPlugin />
          <ClickableLinkPlugin />
          <FloatingTextFormatToolbarPlugin />
        </NewTablePlugin>
        <ImagesPlugin />
        <LinkPlugin />
        <PollPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <ClickableLinkPlugin />
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <TabFocusPlugin />
        <TabIndentationPlugin />
        <CollapsiblePlugin />
        <AutocompletePlugin />
      </div>
    </>
  );
}
