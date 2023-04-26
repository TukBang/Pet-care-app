import {ActivityIndicator, View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import CameraButton from "../../components/Community/CameraButton";
import React, {useEffect, useRef, useState} from 'react';
import PostCard from "../../components/Community/PostCard";
import usePosts from '../../hooks/usePosts';
import {Picker} from '@react-native-picker/picker';
import { useUserContext } from "../../contexts/UserContext";
import events from '../../lib/events';


function CommunityScreen() {
  const [boardCategory, setBoardCategory] = useState("전체");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const {posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost} = usePosts();


  useEffect(() => {
    events.addListener('refresh', onRefresh);
    events.addListener('removePost', removePost);
    return () => {
      events.removeListener('refresh', onRefresh);
      events.removeListener('removePost', removePost);
    };
  }, [onRefresh, removePost]);
  
  // 사용자 uid 가져오기
  const { user } = useUserContext();
  const uid = user["id"];
  const pickerRef = useRef();

  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts.filter((post) => post.category === boardCategory));
    }
  }, [boardCategory, posts]);

  
  // 전체 게시물 조회
  useEffect(() => {
    if (posts) {
      if (boardCategory === '전체') {
        setFilteredPosts(posts);
      } else if (boardCategory === '내 게시물') {
        setFilteredPosts(posts.filter((post) => post.user.id == uid));
      } else {
        setFilteredPosts(posts.filter((post) => post.category === boardCategory));
      }
    }
  }, [boardCategory, posts, uid]);

  return (
    <>
      <View style={styles.block}>
        <Picker
          ref={pickerRef}
          selectedValue={boardCategory}
          onValueChange={(itemValue, itemIndex) =>
            setBoardCategory(itemValue)
          }>
          <Picker.Item label="전체" value="전체" />
          <Picker.Item label="자유" value="자유" />
          <Picker.Item label="상담" value="상담" />
          <Picker.Item label="내 게시물" value="내 게시물" />

        </Picker>
        <CameraButton />
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.75}
          ListFooterComponent={
            !noMorePost && (
              <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
            )
          }
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        />
      </View>
    </>
  );
}
const renderItem = ({item}) => (
  <PostCard
    createdAt={item.createdAt}
    description={item.description}
    title={item.title}
    category={item.category}
    id={item.id}
    user={item.user}
    photoURL={item.photoURL}
  />
);


const styles = StyleSheet.create({
  block: {
    flex: 1,
    zIndex: 0,
  },
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default CommunityScreen;