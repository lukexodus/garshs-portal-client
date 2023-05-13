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
import Placeholder from "./ui/Placeholder";

import Button from "./Button";
import Select from "./Select";
import Input from "./Input";
import Tooltip from "./Tooltip";
import Spinner from "./Spinner";

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

import { useForm, processFormState } from "./hooks/formHook";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { usePopupModal } from "./contexts/PopupModalContext";

import axios from "axios";

const selectSubject = "Select Subject";

const EditLesson = ({
  lesson,
  setMode,
  params,
  setRefetch,
  setIsLessonViewOpen,
  ...props
}) => {
  const text = "Enter lesson content...";
  const placeholder = <Placeholder>{text}</Placeholder>;

  const editorStateRef = useRef(null);
  const attachmentsFileInputRef = useRef(null);
  const { data } = useData();
  const { setToast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [render, setRender] = useState(false);

  const [formState, inputHandler] = useForm({
    title: { value: lesson.title },
    body: { value: lesson.body },
    attachments: { value: lesson.attachments },
    attachmentsToBeDeleted: { value: [] },
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
    editorState: lesson.body,
  };

  const updateLessonHandler = async () => {
    setIsUploading(true);
    if (editorStateRef.current) {
      formState.inputs.body.value = JSON.stringify(editorStateRef.current);
    }
    const processedFormState = processFormState(formState.inputs);
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

    if (attachmentsFileInputRef.current) {
      processedFormState.attachments = attachmentsFileInputRef.current.files;
    } else {
      setToast({
        message: "An error occured in the browser",
        icon: "cross",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", processedFormState.title);
    formData.append("_id", lesson._id);
    formData.append("body", processedFormState.body);
    formData.append("subject", processedFormState.subject);
    if (processedFormState.attachments) {
      for (const attachmentFile of processedFormState.attachments) {
        formData.append("attachments", attachmentFile);
      }
    }

    if (formState.inputs.attachmentsToBeDeleted.value.length !== 0) {
      formData.append(
        "attachmentsToBeDeleted",
        JSON.stringify(formState.inputs.attachmentsToBeDeleted.value)
      );
    }


    setToast(null);

    axios
      .patch("/api/v1/lessons", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setMode("view");
          setRefetch((prev) => !prev);
          setIsLessonViewOpen(false);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
        setIsUploading(false);
      })
      .catch((error) => {
        console.log("Failed to update lesson");
        console.error(error);
      });
  };

  const deleteLessonAttachmentHandler = (attachmentFilename) => {
    formState.inputs.attachmentsToBeDeleted.value.push(attachmentFilename);
    setRender((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col space-y-5 md:space-y-7 justify-center ${props.className}`}
    >
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
          defaultValue={lesson.title}
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
          defaultValue={lesson.subject}
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

      <div className="flex flex-col space-y-1 max-w-[990px] mx-auto w-full">
        <span className="block mb-2 text-sm font-medium text-white">
          Attachments
        </span>
        <ul className="flex flex-col justify-between items-start space-y-2 list-disc list-inside">
          {lesson.attachments.map((attachment, i) => {
            return (
              <li className="w-full">
                <span
                  className={`mr-3 ${
                    formState.inputs.attachmentsToBeDeleted.value.includes(
                      attachment
                    )
                      ? "line-through"
                      : ""
                  }`}
                >
                  {attachment}
                </span>
                <Button
                  variant="danger"
                  size="small"
                  type="button"
                  onClick={() => {
                    deleteLessonAttachmentHandler(attachment);
                  }}
                  pill={true}
                  className={`text-xs ${
                    formState.inputs.attachmentsToBeDeleted.value.includes(
                      attachment
                    )
                      ? "hidden"
                      : ""
                  }`}
                >
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
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
          className="max-w-md my-3"
        />
      </div>
      {!isUploading ? (
        <div className="flex flex-col space-y-0 max-w-[990px] mx-auto w-full">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              updateLessonHandler();
            }}
          >
            Update Lesson
          </Button>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default EditLesson;
