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

import { MdPostAdd } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

import { useForm, processFormState } from "./hooks/formHook";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import { isValidObjectIdString } from "../utils/utils";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { usePopupModal } from "./contexts/PopupModalContext";

import postAsOptions from "../config/postAsOptions";

import axios from "axios";

const postAs = "Post As";

const EditPost = ({
  post,
  setMode,
  setPostRefetch,
  isRefetchedPostReady,
  setPostsRefetchAfterModification,
  ...props
}) => {
  const text = "Enter some text...";
  const placeholder = <Placeholder>{text}</Placeholder>;

  const editorStateRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const { data } = useData();
  const { setToast } = useToast();

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(true);

  useEffect(() => {
    if (data) {
      if (["admin", "superadmin"].push(data.user.role)) {
        if (!postAsOptions.find((obj) => obj.value === data.user._id))
          postAsOptions.push({
            value: data.user._id,
            name: `${data.user.firstName} ${data.user.lastName}`,
          });
      }
    }
  }, [data]);

  let selectDefaultValue;
  if (typeof post.postAs === "string" && isValidObjectIdString(post.postAs)) {
    selectDefaultValue = post.postAs;
  } else {
    selectDefaultValue = JSON.stringify(post.postAs);
  }

  const [formState, inputHandler] = useForm({
    postAs: { value: selectDefaultValue },
    body: { value: "" },
    images: { value: [] },
    imagesToBeDeleted: { value: [] },
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
    editorState: post.body,
  };

  const postHandler = async () => {
    if (editorStateRef.current) {
      formState.inputs.body.value = JSON.stringify(editorStateRef.current);
    }
    const processedFormState = processFormState(formState.inputs);
    if (
      !processedFormState.postAs ||
      processedFormState.postAs === postAs ||
      (editorStateRef.current &&
        JSON.parse(JSON.stringify(editorStateRef.current)).root.children[0]
          .children.length === 0)
    ) {
      setToast({
        message: "Some of the required fields are empty",
        icon: "cross",
      });
      return;
    }
    if (imageFileInputRef.current) {
      processedFormState.images = imageFileInputRef.current.files;
    } else {
      setToast({
        message: "An error occured in the browser",
        icon: "cross",
      });
      return;
    }

    let hasImages = false;
    if (processedFormState.images && processedFormState.images.length !== 0) {
      hasImages = true;
      console.log("has images");
    }

    if (hasImages) {
      setIsReadyToSubmit(false);

      try {
        const res = await axios.get("/api/v1/data", {
          params: { dataToFetch: JSON.stringify(["postsImagesFilenames"]) },
        });

        console.log("res.data", res.data);

        if (res.data.success) {
          console.log("res.data", res.data);
          let imageFilenames = res.data.postsImagesFilenames;

          for (const imageFile of processedFormState.images) {
            console.log(
              "imageFilenames.includes(imageFile.name)",
              imageFilenames.includes(imageFile.name)
            );
            if (imageFilenames.includes(imageFile.name)) {
              setToast({
                message: `A '${imageFile.name}' file is already uploaded. Please rename the file.`,
                icon: "cross",
              });
              setIsReadyToSubmit(true);
              return;
            }
          }

          setIsReadyToSubmit(true);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      } catch (err) {
        console.log("Failed to fetch filenames list");
        console.error(err);
      }
    }

    const formData = new FormData();
    formData.append("body", processedFormState.body);
    formData.append("postAs", processedFormState.postAs);
    formData.append("_id", post._id);
    if (processedFormState.images) {
      for (const imageFile of processedFormState.images) {
        formData.append("images", imageFile);
      }
    }
    if (formState.inputs.imagesToBeDeleted.value) {
      formData.append(
        "imagesToBeDeleted",
        JSON.stringify(formState.inputs.imagesToBeDeleted.value)
      );
    }

    console.log("processedFormState", processedFormState);
    setToast(null);

    axios
      .patch("/api/v1/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setToast({ message: res.data.msg, icon: "check", lifetime: 5000 });
          setMode("view");
          // setPostRefetch((prev) => !prev);
          setPostsRefetchAfterModification((prev) => !prev);
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((error) => {
        console.log("Failed to update post");
        console.error(error);
      });
  };

  const deletePostImageHandler = (imageFilename) => {
    formState.inputs.imagesToBeDeleted.value.push(imageFilename);
    console.log(
      "formState.inputs.imagesToBeDeleted.value",
      formState.inputs.imagesToBeDeleted.value
    );
  };

  return (
    <div className={`bg-white px-6 py-4 rounded-lg ${props.className}`}>
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className=" text-xl font-medium text-gray-900 ">Edit Post</h3>
      </div> */}
      <div className="space-y-6">
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
        <div className="flex flex-wrap">
          {post.images.map((imageFilename, i) => {
            return (
              <ImageWithDeleteButton
                src={`/posts/images/${imageFilename}`}
                key={i}
                deletePostImageHandler={deletePostImageHandler}
                imageFilename={imageFilename}
              />
            );
          })}
        </div>
        <div className="cursor-pointer">
          <label
            htmlFor="fileInput"
            className="text-sm font-medium text-gray-900 mb-2 flex items-center"
          >
            Add Images&nbsp;<span className="font-light">(Optional)</span>{" "}
            <Tooltip
              size={25}
              message="The first image will be used as the cover image of the post."
              className="inline-block"
            />
          </label>
          <Input
            id="imageFileInput"
            name="imageFileInput"
            element="input"
            accept="image/*"
            multiple="multiple"
            type="file"
            ref={imageFileInputRef}
            variant="simple"
            size="normalEven"
            onInput={() => {}}
            className="max-w-xs"
          />
        </div>
        {isReadyToSubmit ? (
          <div className="flex justify-start items-center space-x-1">
            <Button
              variant="primary"
              className="flex items-center"
              size="withIcon"
              onClick={(event) => {
                event.preventDefault();
                postHandler();
              }}
            >
              <MdPostAdd size={18} /> Update
            </Button>
            <Select
              id="postAs"
              name="postAs"
              arrayOfData={postAsOptions}
              onSelect={inputHandler}
              label={postAs}
              className="w-auto mt-1"
              display="inline-block"
              variant="simple"
              size="normal2"
              defaultValue={selectDefaultValue}
            />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default EditPost;

const ImageWithDeleteButton = ({
  imageFilename,
  deletePostImageHandler,
  src,
  ...props
}) => {
  const [showDeletionIndication, setShowDeletionIndication] = useState(false);

  const { setPopupModal } = usePopupModal();

  return (
    <div key={props.key} className="mt-4 mr-4 relative group">
      {showDeletionIndication ? (
        <span className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center ">
          <h4 className="text-lg font-bold tracking-wide bg-red-400 text-red-700 px-3 py-2 rounded-2xl">
            TO BE DELETED
          </h4>
        </span>
      ) : (
        <span
          className={`absolute top-4 right-2 invisible group-hover:visible pl-0 pr-1 lg:pr-2 py-0 md:px-1 rounded`}
        >
          <MdDeleteForever
            className="w-10 h-10 text-red-300 hover:text-red-500"
            onClick={() => {
              setPopupModal({
                message: `Are you sure you want to delete this image (${imageFilename})?`,
                variant: "danger",
                primary: "Delete",
                handler: () => {
                  deletePostImageHandler(imageFilename);
                  setShowDeletionIndication(true);
                },
              });
            }}
          />
        </span>
      )}
      <img src={src} className="w-[18rem] rounded-xl" />
    </div>
  );
};
