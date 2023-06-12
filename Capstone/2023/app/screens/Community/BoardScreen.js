import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  ScrollView
} from "react-native";

import { useUserContext } from "../../contexts/UserContext";
import usePosts from "../../hooks/usePosts";
import { getComments, createComment } from "../../lib/comment";
import useComments from "../../hooks/useComments";
import { RefreshControl } from "react-native";
import events from "../../lib/events";
import CommentCard from "../../components/Community/CommentCard";
import DetailPostCard from "../../components/Community/DetailPostCard";

// CommunityScreen 에서 게시글을 클릭하면 나오는 화면
// PostCard의 navigation.push 를 통해서 온다

function BoardScreen({ route }) {
  // route에서 post에 대한 파라미터를 불러온다.
  const { post_param } = route.params;
  const { user: me } = useUserContext();
  //me.id ( 현재 로그인 되어있는 세션) 와 user.id (게시글의 주인)
  //을 비교하여 isMyPost 에 내 게시물인지 bool 형태로 저장

  //------------------------댓글 관련------------------------//

  // postId 에 따라 댓글을 가져오기 위한 filteredComments 변수
  const [filteredComments, setFilteredComments] = useState(null);

  //업로드할 댓글을 담고 있는 변수
  const [txt, setTxt] = useState("");

  //useComment에서 가져온 함수들
  const {
    comments,
    noMoreComment,
    refreshingComment,
    onLoadMoreComments,
    onRefreshComment,
    removeComment,
  } = useComments();

  //필터를 통해 같은 postId를 가지고 있는 댓글만 표기
  useEffect(() => {
    if (comments) {
      setFilteredComments(comments.filter((comment) => comment.postId === post_param.id));
    }
  }, [post_param.id, comments]);

  // 작성 버튼 onPress
  const onSubmit = useCallback(async () => {
    await createComment({
      txt: txt,
      postId: post_param.id,
      user: me,
      // photoURL: me.photoURL,
    });
    setTxt("");
    events.emit("refreshComment");
  });

  //------------------------댓글 관련------------------------//

  //------------------------게시글 관련------------------------//

  // post.id 에 따라 댓글을 가져오기 위한 filteredPosts 변수
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost } = usePosts();
  const [ board, setBoard ] = useState({
    createdAt: "",
    description: "",
    title: "",
    category: "",
    id: "",
    user: "",
    photoURL: null,
  })
  // useEffect로 filteredPost에 post.id 에 따라 post 저장
  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts.filter((post) => post.id === post_param.id));
      console.log(filteredPosts)  
    }
  }, [post_param, posts]);

  // filteredPosts 배열이 업데이트되었을 때 board 상태를 업데이트
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const post = filteredPosts[0]; // 첫 번째 요소를 사용하거나 필요에 따라 적절한 방식으로 선택
      setBoard({
        createdAt: post.createdAt,
        description: post.description,
        title: post.title,
        category: post.category,
        id: post.id,
        user: post.user,
        photoURL: post.photoURL,
      });
    }
  }, [filteredPosts]);

  //------------------------게시글 관련------------------------//


  const onCombinedRefresh = useCallback(() => {
    onRefresh();
    onRefreshComment();
  }, []);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={onCombinedRefresh}
            refreshing={refreshing || refreshingComment}
          />
        }>
        <View style={styles.block}>
          {/* 게시물 공간 */}
          <DetailPostCard {...board} />
          {/* 댓글 입력 공간 */}
          <View style={{ marginBottom: 15 }}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글 입력"
              placeholderTextColor={"#BCBCBC"}
              value={txt}
              onChangeText={(value) => setTxt(value)}
            />
            <Button onPress={onSubmit} title="작성" />
          </View>
          <Text> 댓글 </Text>
          {/* 댓글 목록 및 업데이트 */}
          <View style={{ marginTop: 5 }}>
            {filteredComments ? (
              filteredComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  createdAt={comment.createdAt}
                  txt={comment.txt}
                  postId={comment.postId}
                  user={comment.user}
                  id={comment.id}
                />
              ))
            ) : (
              <Text>댓글이 없습니다. 첫 댓글을 작성해보세요!</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    margin: 10,
  },
  paddingBlock: {
    paddingHorizontal: 0,
  },
});

export default BoardScreen;
