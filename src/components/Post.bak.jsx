import React, { useState, useEffect } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Post = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSaveClick = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    console.log(content);
  };

  return (
    <div>
      <h2>Post</h2>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="bg-white text-gray-800 my-5 "
        editorClassName="px-4 py-1 leading-none"
        toolbarClassName="bg-gray-100"
        toolbar={{}}
        placeholder="Enter your text here"
      />

      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default Post;
