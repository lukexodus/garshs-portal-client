import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
import { useData } from "./contexts/DataContext";
import Events from "./Events";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";
import Spinner from "./Spinner";
import Input from "./Input";
import Avatar from "./Avatar";
import axios from "axios";
import PostCardContainer from "./PostCardContainer";
import AnnouncementsGlobal from "./AnnouncementsGlobal";
import Tabs2 from "./Tabs2";
import ScrollToTopButton from "./ScrollToTopButton";
import OrgButton from "./OrgButton";

import { TfiAnnouncement } from "react-icons/tfi";
import { IoCalendar } from "react-icons/io5";
import { NODE_ENV } from "../config/config";
import useUpdateEffect from "./hooks/useUpdateEffect";

const AddPost = lazy(() => import("./AddPost"));

const tabs = [
  {
    value: "announcements",
    name: (
      <span className="flex space-x-2 items-center justify-center">
        <TfiAnnouncement size={22} />
        <span className="">Announcements</span>
      </span>
    ),
  },
  {
    value: "events",
    name: (
      <span className="flex space-x-2 items-center justify-center">
        <IoCalendar size={21} />
        <span className="">Events</span>
      </span>
    ),
  },
];

const Home = ({ ...props }) => {
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [canAddPost, setCanAddPost] = useState(false);
  const [previousLastId, setPreviousLastId] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [noMoreItems, setNoMoreItems] = useState(false);
  const [isPostsReady, setIsPostsReady] = useState(false);
  const [posts, setPosts] = useState([]);
  const [orgPostsCount, setOrgPostsCount] = useState([]);
  const [initialFetchFinished, setInitialFetchFinished] = useState(false);
  const [refetchTriggered, setRefetchTriggered] = useState(false);
  const [tab, setTab] = useState("announcements");
  const [postsRefetch, setPostsRefetch] = useState(false);
  const [postsRefetchAfterModification, setPostsRefetchAfterModification] =
    useState(false);
  const [author, setAuthor] = useState(null);

  let noMoreItemsRef = useRef(false);
  let skipFirstLoadMore = useRef(true);

  const { data } = useData();
  const { setToast } = useToast();
  const { setCustomModal } = useCustomModal();

  const offset = 1000;

  useEffect(() => {
    const handleScroll = () => {
      if (
        !noMoreItemsRef.current &&
        skipFirstLoadMore.current === false &&
        document.documentElement.scrollTop +
          document.documentElement.clientHeight >=
          document.documentElement.scrollHeight - offset
      ) {
        setLoadMore((prev) => !prev);
        setRefetchTriggered(true);
        setTimeout(setRefetchTriggered(false), 2000);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useUpdateEffect(() => {
    if (isPostsReady && orgPostsCount.length !== 0 && author) {
      document.title = `GARSHS Portal | ${
        orgPostsCount.find((obj) => obj.name.short === author).name.long
      }`;
    }
    if (author) {
      setPosts([]);
      setInitialFetchFinished(false);
      setPostsRefetch((prev) => !prev);
    }
  }, [author]);

  useUpdateEffect(() => {
    if (initialFetchFinished) {
      setPosts([]);
      setPostsRefetch((prev) => !prev);
    }
  }, [postsRefetchAfterModification]);

  const getPostsEffectRan = useRef(false);

  useEffect(() => {
    if (getPostsEffectRan.current === true || NODE_ENV !== "development") {
      let params = {};
      if (posts.length !== 0 && initialFetchFinished) {
        params = { ...params, previousLastId };
      }
      if (author) {
        params = { ...params, author };
      }
      axios
        .get("/api/v1/posts", { params: params })
        .then((res) => {
          if (res.data.success) {
            if (author) {
              setPosts([...res.data.posts]);
            } else {
              setPosts([...posts.concat(res.data.posts)]);
            }
            setOrgPostsCount(res.data.orgPostsCount);
            setIsPostsReady(true);
            setInitialFetchFinished(true);
            skipFirstLoadMore.current = false;
            if (res.data.posts.length < 10) {
              setNoMoreItems(true);
              noMoreItemsRef.current = true;
            } else {
              noMoreItemsRef.current = false;
            }
            if (res.data.posts && res.data.posts.length !== 0) {
              setPreviousLastId(res.data.posts[res.data.posts.length - 1]._id);
            }
          } else {
            setToast({ message: res.data.msg, icon: "cross" });
          }
        })
        .catch((err) => {
          console.log("Error fetching posts");
          console.error(err);
        });
    }
    return () => {
      getPostsEffectRan.current = true;
    };
  }, [loadMore, postsRefetch]);

  useEffect(() => {
    if (data) {
      if (["admin", "superadmin"].includes(data.user.role)) {
        setCanAddPost(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (posts) {
      console.log(
        "posts",
        posts.map((post) => post.postAs)
      );
    }
  }, [posts]);

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
      <div className="2xl:col-span-1 hidden 2xl:flex 2xl:flex-col 2xl:space-y-3 2xl:pl-6 2xl:pt-4 fixed left-0 max-h-screen overflow-y-auto w-1/4 divide-y-[1px] divide-gray-300">
        <Events bgBehindColor="white" showHeader={false} />
        <AnnouncementsGlobal bgBehindColor="white" className="pt-6" />
      </div>
      <div
        className={`flex flex-col space-y-5 w-full items-center overflow-x-hidden max-w-2xl lg:max-w-[39rem] 2xl:max-w-3xl self-center mx-auto lg:col-span-2 lg:pl-2 2xl:pl-3 3xl:pl-5 2xl:col-start-2`}
      >
        <div className="w-full bg-white mt-5 shadow-sm flex flex-col items-center max-w-2xl sm:rounded-lg 2xl:hidden">
          <Tabs2
            options={tabs}
            state={tab}
            stateHandler={setTab}
            className=""
          />
          <div className="w-full border-t-[1px] border-gray-300 p-3">
            {tab === "announcements" ? (
              <AnnouncementsGlobal bgBehindColor="white" />
            ) : tab === "events" ? (
              <Events bgBehindColor="white" showHeader={false} />
            ) : (
              ""
            )}
          </div>
        </div>
        {isPostsReady ? (
          <div className="bg-white shadow-sm max-w-2xl sm:rounded-lg flex space-x-5 overflow-x-auto px-5 py-3 self-start lg:hidden">
            {orgPostsCount
              .sort((a, b) => b.count - a.count)
              .map((orgPostCount, i) => (
                <OrgButton
                  author={author}
                  setAuthor={setAuthor}
                  orgPostCount={orgPostCount}
                  mode="compact"
                  i={i}
                  setPostsRefetchAfterModification={
                    setPostsRefetchAfterModification
                  }
                />
              ))}
          </div>
        ) : (
          <></>
        )}
        {canAddPost && isPostsReady ? (
          <>
            {localStorage.getItem("data") && !isAddPostOpen ? (
              <div className="w-full bg-white mt-5 shadow-sm flex space-x-2 items-center px-3 py-1 max-w-2xl sm:rounded-lg">
                <Avatar user={data.user} />
                <Input
                  element="input"
                  id="addPost"
                  name="addPost"
                  type="text"
                  variant="onWhite"
                  onInput={() => {}}
                  size="mid"
                  pill={true}
                  onClick={() => {
                    setIsAddPostOpen(true);
                  }}
                  className="cursor-pointer hover:bg-gray-200"
                  placeholder={`What's up at GARSHS, ${data.user.firstName}?`}
                />
              </div>
            ) : (
              <></>
            )}
            {isAddPostOpen ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-full mt-5 py-5">
                    <Spinner />
                  </div>
                }
              >
                <AddPost
                  hideAddPost={() => {
                    setIsAddPostOpen(false);
                  }}
                  className="mt-5 shadow-sm max-w-2xl"
                  setPostsRefetch={setPostsRefetch}
                  setPostsRefetchAfterModification={
                    setPostsRefetchAfterModification
                  }
                />
              </Suspense>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {isPostsReady ? (
          posts.length !== 0 ? (
            <>
              {posts.map((post, i) => {
                return (
                  <PostCardContainer
                    post={post}
                    i={i}
                    setPostsRefetch={setPostsRefetch}
                    setPostsRefetchAfterModification={
                      setPostsRefetchAfterModification
                    }
                  />
                );
              })}
            </>
          ) : (
            <span className="mt-5 font-light text-sm">{`No posts yet ${
              isPostsReady && orgPostsCount.length !== 0 && author
                ? `from ${
                    orgPostsCount.find((obj) => obj.name.short === author).name
                      .long
                  } `
                : ""
            }`}</span>
          )
        ) : (
          <Spinner />
        )}

        {refetchTriggered && !noMoreItems ? <Spinner /> : <></>}

        {initialFetchFinished && noMoreItems ? (
          <span className="py-5 font-light text-sm">
            You've reached the end!
          </span>
        ) : (
          <></>
        )}
        <ScrollToTopButton className="fixed bottom-5 right-5" />
      </div>

      {isPostsReady ? (
        <div className="overflow-x-auto px-5 hidden lg:flex lg:flex-col lg:justify-between h-screen py-7 pr-6 lg:col-span-1 fixed right-0 max-h-screen overflow-y-auto lg:w-1/3 2xl:w-1/4">
          <div className="lg:flex lg:flex-col lg:space-y-3">
            {orgPostsCount
              .sort((a, b) => b.count - a.count)
              .map((orgPostCount, i) => (
                <OrgButton
                  author={author}
                  setAuthor={setAuthor}
                  orgPostCount={orgPostCount}
                  mode="extended"
                  setPostsRefetchAfterModification={
                    setPostsRefetchAfterModification
                  }
                  i={i}
                />
              ))}
          </div>
          <div className="absolute bottom-14 flex items-center justify-center w-full py-3 overflow-x-auto text-[0.7rem] space-x-5">
            <a
              className=" hover:underline cursor-pointer font-light text-gray-500"
              href="/terms-of-use"
              target="_blank"
            >
              Terms of Use
            </a>
            <a
              className="text-[0.7rem] hover:underline cursor-pointer font-light text-gray-500"
              href="/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
