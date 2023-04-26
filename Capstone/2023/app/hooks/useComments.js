import {useEffect, useState, useCallback} from 'react';
import {getNewerComments, getOlderComments, getComments, PAGE_SIZE} from '../lib/comment';
import { useUserContext } from '../contexts/UserContext';
import useCommentEventEffect from './useCommentEventEffect';


export default function useComments(userId) {
  const [comments, setComments] = useState(null);
  const [noMoreComment, setNoMoreComment] = useState(false);
  const [refreshingComment, setrefreshingComment] = useState(false);
  const {user} = useUserContext();

  const onLoadMoreComments = async () => {
    if (noMoreComment || !comments || comments.length < PAGE_SIZE) {
      return;
    }
    const lastPost = comments[comments.length - 1];
    const oldercomments = await getOlderComments(lastPost.id, userId);
    if (oldercomments.length < PAGE_SIZE) {
      setNoMoreComment(true);
    }
    setComments(comments.concat(oldercomments));
  };

  const onRefreshComment = useCallback(async () => {
    if (!comments || comments.length === 0 || refreshingComment) {
      return;
    }
    const firstPost = comments[0];
    setrefreshingComment(true);
    const newercomments = await getNewerComments(firstPost.id, userId);
    setrefreshingComment(false);
    if (newercomments.length === 0) {
      return;
    }
    setComments(newercomments.concat(comments));
  }, [comments, userId, refreshingComment]);

  const removeComment = useCallback(
    (postId) => {
      setComments(comments.filter((post) => post.id !== postId));
    },
    [comments],
  );

  useEffect(() => {
    getComments({userId}).then((_comments) => {
      setComments(_comments);
      if (_comments.length < PAGE_SIZE) {
        setNoMoreComment(true);
      }
    });
  }, [userId]);

  const updateComment = useCallback(
    ({postId, title,description}) => {
      // id가 일치하는 포스트를 찾아서 description 변경
      const nextcomments = comments.map((comment) =>
        post.id === postId
          ? {
              ...post,
              title,
              description,
            }
          : post,
      );
      setComments(nextcomments);
    },
    [comments],
  );

  useCommentEventEffect({
    refreshComment: onRefreshComment,
    removeComment,
    enabled: !userId || userId === user.id,
    updateComment
  });

  return {
    comments,
    noMoreComment,
    refreshingComment,
    onLoadMoreComments,
    onRefreshComment,
    removeComment,
  };
}