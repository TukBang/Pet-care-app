import { useEffect, useState, useCallback } from "react";
import { getNewerPosts, getOlderPosts, getPosts, PAGE_SIZE } from "../../lib/post";
import { useUserContext } from "../../contexts/UserContext";
import usePostsEventEffect from "./usePostEventEffect";

// 비슷한 함수의 재사용을 막기위해 정리

export default function usePosts(category, isExpert) {
  const [posts, setPosts] = useState(null);
  const [noMorePost, setNoMorePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();

  // 게시물이 pagesize가 넘는경우 추가로 불러오기
  const onLoadMore = async () => {
    if (noMorePost || !posts || posts.length < PAGE_SIZE) {
      return;
    }
    const lastPost = posts[posts.length - 1];
    const olderPosts = await getOlderPosts(lastPost.id, category, isExpert);
    if (olderPosts.length < PAGE_SIZE) {
      setNoMorePost(true);
    }
    setPosts(posts.concat(olderPosts));
  };

  //게시글 새로고침
  const onRefresh = useCallback(async () => {
    if (!posts || posts.length === 0 || refreshing) {
      return;
    }
    const firstPost = posts[0];
    setRefreshing(true);
    const newerPosts = await getNewerPosts(firstPost.id, category, isExpert);
    setRefreshing(false);
    if (newerPosts.length === 0) {
      return;
    }
    setPosts(newerPosts.concat(posts));
  }, [posts, refreshing]);

  //게시글 삭제
  const removePost = useCallback(
    (postId) => {
      setPosts(posts.filter((post) => post.id !== postId));
    },
    [posts]
  );

  useEffect(() => {
    setPosts(null);
    setNoMorePost(false);
    getPosts(category, isExpert).then((_posts) => {
      setPosts(_posts);
      if (_posts.length < PAGE_SIZE) {
        setNoMorePost(true);
      }
    });
    
  }, [category]);

  const updatePost = useCallback(
    ({ postId, title, description }) => {
      // id가 일치하는 포스트를 찾아서 description 변경
      const nextPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              title,
              description,
            }
          : post
      );
      setPosts(nextPosts);
    },
    [posts]
  );

  usePostsEventEffect({
    refresh: onRefresh,
    removePost,
    enabled: true,
    updatePost,
  });

  return {
    posts,
    noMorePost,
    refreshing,
    onLoadMore,
    onRefresh,
    removePost,
  };
}
