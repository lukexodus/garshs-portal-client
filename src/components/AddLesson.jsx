import React, { useState, useRef } from "react";
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
import Placeholder from "./ui/Placeholder";

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

import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

import { useForm, processFormState } from "./hooks/formHook";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";

import axios from "axios";

const selectSubject = "Select Subject";

import { IoMdArrowRoundBack } from "react-icons/io";
import Spinner from "./Spinner";

const AddLesson = ({
  setRefetch,
  params,
  setIsLessonViewOpen,
  setIsInAddLessonMode,
  ...props
}) => {
  const text = "Enter lesson content...";
  const placeholder = <Placeholder>{text}</Placeholder>;

  const editorStateRef = useRef(null);
  const attachmentsFileInputRef = useRef(null);
  const { data } = useData();
  const { setToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const [formState, inputHandler, setFormData] = useForm({
    title: { value: "" },
    body: { value: "" },
    attachments: { value: [] },
    subject: { value: params.subject },
  });

  const initialConfig = {
    namespace: "Playground",
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
    theme: PlaygroundEditorTheme,
  };

  const addLessonHandler = async () => {
    setIsUploading(true);
    if (editorStateRef.current) {
      formState.inputs.body.value = JSON.stringify(editorStateRef.current);
    }

    const processedFormState = processFormState(formState.inputs);

    if (attachmentsFileInputRef.current) {
      processedFormState.attachments = attachmentsFileInputRef.current.files;
    } else {
      setToast({
        message: "An error occured in the browser",
        icon: "cross",
      });
      return;
    }

    console.log("processedFormState", processedFormState);

    if (
      !processedFormState.subject ||
      processedFormState.subject === selectSubject ||
      !processedFormState.title ||
      (editorStateRef.current &&
        JSON.parse(JSON.stringify(editorStateRef.current)).root.children[0]
          .children.length === 0 &&
        processedFormState.attachments.length === 0)
    ) {
      setToast({
        message: "Some of the required fields are empty",
        icon: "cross",
      });
      return;
    }

    setToast(null);

    const formData = new FormData();
    formData.append("title", processedFormState.title);
    formData.append("body", processedFormState.body);
    formData.append("subject", processedFormState.subject);
    if (processedFormState.attachments) {
      for (const attachmentFile of processedFormState.attachments) {
        formData.append("attachments", attachmentFile);
      }
    }

    axios
      .post("/api/v1/lessons", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setIsInAddLessonMode(false);
          setRefetch((prev) => !prev);
          setIsUploading(false);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to add post");
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col space-y-5 md:space-y-6 justify-center">
      <div className="pt-2 flex items-center justify-start">
        <span
          className="flex items-center group self-start"
          onClick={() => {
            setIsLessonViewOpen(false);
            setIsInAddLessonMode(false);
          }}
        >
          <span className="mr-1">
            <IoMdArrowRoundBack size={27} />
          </span>
          <span className="text-lg group-hover:underline">Go back</span>
        </span>
      </div>
      <div className="max-w-[990px] mx-auto w-full">
        <Input
          element="input"
          size="normalEven"
          variant="simple"
          id="title"
          name="title"
          type="text"
          placeholder="Enter lesson title"
          label="Title"
          labelStyle="block mb-2 text-sm font-medium text-white"
          onInput={inputHandler}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-col space-y-0 max-w-[990px] mx-auto w-full">
        <span className="block mb-2 text-sm font-medium text-white">
          Subject
        </span>
        <Select
          id="subject"
          name="subject"
          arrayOfData={data.map.subjects}
          onSelect={inputHandler}
          label={selectSubject}
          className="w-auto max-w-md truncate mx-0"
          containerClassName="max-w-full truncate"
          display="inline-block"
          variant="simple"
          size="normal2"
          defaultValue={params.subject}
        />
      </div>
      <div className="flex flex-col space-y-0 max-w-[990px] mx-auto w-full">
        <span className="block mb-2 text-sm font-medium text-white">
          Content
        </span>
        <div className="editor-shell">
          <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
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
                placeholder={placeholder}
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
              <OnChangePlugin
                onChange={(editorState) =>
                  (editorStateRef.current = editorState)
                }
              />
            </div>
          </LexicalComposer>
        </div>
      </div>
      <div className="flex flex-col space-y-0 max-w-[990px] mx-auto w-full">
        <span className="block mb-2 text-sm font-medium text-white">
          Attachments
        </span>
        <Input
          id="attachmentFileInput"
          name="attachmentFileInput"
          element="input"
          accept=""
          multiple="multiple"
          type="file"
          ref={attachmentsFileInputRef}
          variant="simple"
          size="normalEven"
          onInput={() => {}}
          className="max-w-md"
        />
      </div>

      {isUploading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col space-y-0 max-w-[990px] mx-auto w-full">
          <Button
            variant="primary"
            className="w-full"
            //   bg-blue-100 text-blue-800
            onClick={() => {
              addLessonHandler();
            }}
          >
            Add Lesson
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddLesson;
