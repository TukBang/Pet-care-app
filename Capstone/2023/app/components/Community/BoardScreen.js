import React, {useMemo, useState, useCallback, useEffect} from "react";
import { StyleSheet, View, Text,Image, Pressable,TextInput,Button,FlatList } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheetModal from "../ActionSheetModal";
import usePostActions from "../../hooks/usePostAciton";
import { getComments, createComment } from "../../lib/comment";
import CommentCard from "./CommentCard";
import useComments from "../../hooks/useComments";
import { ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native";
import events from "../../lib/events";
import {format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

function BoardScreen({route}) {
    const {post} = route.params;
    const user  = post.user;
    const {user: me} = useUserContext();
    const isMyPost = me.id === user.id;

    // const [comments, setComments ] = useState(null);
    const [filteredComments ,setFilteredComments] = useState(null);
    const [txt, setTxt] = useState('');

    const {comments,noMoreComment,refreshingComment, onLoadMoreComments, onRefreshComment, removeComment} = useComments();

    useEffect(() => {
        events.addListener('refreshComment', onRefreshComment);
        events.addListener('removeComment', removeComment);
        return () => {
          events.removeListener('refreshComment', onRefreshComment);
          events.removeListener('removeComment', removeComment);
        };
      }, [onRefreshComment, removeComment]);
    // 표기하기 위한 게시글 불러오기
    const {isSelecting, onPressMore, onClose, actions} = usePostActions({
        id:post.id,
        description:post.description,
        title:post.title,
        photoURL:post.photoURL,
      });
    const onOpenProfile = () => {
        // TODO: 사용자 프로필 화면 열기
    };
    // 댓글에 달 시간 
    const date = useMemo(
        () => (post.createdAt ? new Date(post.createdAt._seconds * 1000) : new Date()),
        [post.createdAt],
      );
    
      // 작성 버튼 onPress
    const onSubmit = useCallback(async () => {
        await createComment({
            txt: txt,
            postId: post.id,
            user: me,
            // photoURL: me.photoURL,
        });
        setTxt('');
        events.emit('refreshComment')
    })

    // useEffect(() => {
    //     // 컴포넌트가 처음 마운트될 때 포스트 목록을 조회한 후 `posts` 상태에 담기
    //     getComments().then(setComments);
    //   }, []);
      // 필터링
    useEffect(() => {
        if (comments) {
          setFilteredComments(comments.filter((comment) => comment.postId === post.id));
        }
      }, [post.id, comments]);
    return (
      <>
        <View style={styles.block}>
          <View style={styles.paddingBlock}>
            <View style={styles.head}>
              <Pressable style={styles.profile} onPress={onOpenProfile}>
                <Image
                  source={
                    post.user.photoURL ? { uri: post.user.photoURL } : require('../../assets/user.png')
                  }
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <Text style={styles.displayName}>{post.user.displayName + " 님"}</Text>
                <Text 
                  numberOfLines={2} 
                  ellipsizeMode="tail" 
                  style={styles.boardTitle}
                >
                  {"[" + post.category + "] - "}{post.title}
                </Text>
              </Pressable>
              {isMyPost && (
                <Pressable
                  style={{marginBottom: 3, alignSelf: 'flex-end'}} 
                  onPress={onPressMore} 
                  hitSlop={8}
                >
                  <Icon name="more-vert" size={24} />
                </Pressable>
              )}
            </View>
          </View>
          <Text date={date} style={styles.date}>
            {format(date, 'MM월 dd일 (EEE) hh시 mm분', {locale: ko})}에 작성됨
          </Text>

          <Image
            source={{uri: post.photoURL}}
            style={styles.image}
            resizeMode="contain"
            transform={[{scale: 1}]}
          />
            
          <View style={styles.paddingBlock}>
            <Text style={styles.description}>{post.description}</Text>                  
          </View>

          <View style={{marginBottom: 15}}>
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

          <View style={{flex: 1, marginTop: 5}}>
            <FlatList
              data={filteredComments}
              renderItem={renderItemComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.container}
            //   onEndReached={onLoadMoreComments}
            //   onEndReachedThreshold={0.75}
            //   ListFooterComponent={
            //       !noMoreComment && (
            //       <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
            //       )
            //   }
              refreshControl={
                <RefreshControl onRefresh={onRefreshComment} refreshing={refreshingComment} />
              }
            />
          </View>
        </View>

        <ActionSheetModal
          visible={isSelecting}
          actions={actions}
          onClose={onClose}
        />
      </>
    )
}

const renderItemComment = ({item}) => (
    <CommentCard
      createdAt={item.createdAt}
      txt={item.txt}
      postId={item.postId}
      user={item.user}
      id={item.id}
    />
  );


const styles = StyleSheet.create({
    block: {
        margin: 10,
        flex: 1,
        // paddingBottom: 16,
      },
      paddingBlock: {
        paddingHorizontal: 0,
      },

      head: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
      },

      avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
      },
      
      
      profile: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      displayName: {
        lineHeight: 20,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
      },

      boardTitle: {
        lineHeight: 20,
        fontSize: 16,
        marginLeft: 5,
        fontWeight: 'bold',
      },

      date: {
        color: '#757575',
        fontSize: 12,
        lineHeight: 20,
        marginTop: 5,
        marginLeft: 3,
        marginBottom: 10,
      },

      image: {
        height: "30%",
        width: "30%",
        aspectRatio: 1,

        marginTop: 5,
        marginBottom: 10,
      },

      description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
      },

      commentInput: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#CDCDCD",
        paddingVertical: 5,
        paddingHorizontal: 12,
      },   
      
      container: {
        paddingBottom: 48,
      },
});

export default BoardScreen;