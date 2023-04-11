import React, { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard";
import axios from "axios";
import useUpdateEffect from "./hooks/useUpdateEffect";
import { NODE_ENV } from "../config/config";

const PostCardContainer = ({
  post,
  i,
  setPostsRefetch,
  setPostsRefetchAfterModification,
  ...props
}) => {
  // const [postRefetch, setPostRefetch] = useState(false);
  const [postDoc, setPost] = useState(post);
  // const [isRefetchedPostReady, setIsRefetchedPostReady] = useState(true);

  // useUpdateEffect(() => {
  //   console.log("postDoc", postDoc);
  // }, [postDoc]);

  // useUpdateEffect(() => {
  //   console.log("isRefetchedPostReady", isRefetchedPostReady);
  // }, [isRefetchedPostReady]);

  // useUpdateEffect(() => {
  //   console.log("post refetch", postDoc._id);
  //   setIsRefetchedPostReady(false);
  //   axios
  //     .get("/api/v1/post", {
  //       params: { _id: postDoc._id },
  //     })
  //     .then((res) => {
  //       if (res.data.success) {
  //         setPost({ ...res.data.post });
  //         setIsRefetchedPostReady(true);
  //       } else {
  //         setToast({ message: res.data.msg, icon: "cross" });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Error refetching post");
  //       console.error(err);
  //     });
  // }, [postRefetch]);

  return (
    <PostCard
      post={postDoc}
      key={i}
      setPostsRefetch={setPostsRefetch}
      // setPostRefetch={setPostRefetch}
      setPostsRefetchAfterModification={setPostsRefetchAfterModification}
      // setIsRefetchedPostReady={setIsRefetchedPostReady}
      // isRefetchedPostReady={isRefetchedPostReady}
    />
  );
};

export default PostCardContainer;
