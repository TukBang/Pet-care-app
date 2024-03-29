import { ActivityIndicator, View, FlatList, StyleSheet, RefreshControl } from "react-native";
import CameraButton from "../../components/Community/CameraButton";
import React, { useEffect, useRef, useState } from "react";
import PostCard from "../../components/Community/PostCard";
import usePosts from "../../hooks/posts/usePosts";
import { Picker } from "@react-native-picker/picker";
import { useUserContext } from "../../contexts/UserContext";
import { useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

// 커뮤니티 메인화면
function CommunityScreen() {
  const [boardCategory, setBoardCategory] = useState("전체");
  const route = useRoute();
  useEffect(() => {
    if (route.params?.boardCategory) {
      setBoardCategory(route.params.boardCategory);
    }
  }, [route.params?.boardCategory]);
  
  // 사용자 uid 가져오기
  const { user } = useUserContext();
  const uid = user["id"];
  const pickerRef = useRef();
  
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost } = usePosts(boardCategory, user["isExpert"]);

  //category에 따라 filtered 된 post 가져오기
  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts);
    }
  }, [posts, boardCategory]);



  return (
    <LinearGradient
      colors={['#f6faff', '#f6faff']}
      // colors={['#F0F8FF', '#D1EEFD']}

      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.block}>
        {/* 게시글 추가버튼 */}
        <CameraButton setBoardCategory={setBoardCategory}/>
        {/* 카테고리를 정하는 picker */}
        <Picker
          ref={pickerRef}
          selectedValue={boardCategory}
          onValueChange={(itemValue, itemIndex) => setBoardCategory(itemValue)}
        >
          <Picker.Item label="전체" value="전체" />
          <Picker.Item label="자유" value="자유" />
          <Picker.Item label="상담" value="상담" />
          <Picker.Item label="내 게시물" value="내 게시물" />
        </Picker>
        <View style={styles.border} />
        {/* 필터링 된 posts 를 렌더링후 flat리스트로 보여줌 */}
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.75}
          ListFooterComponent={
            !noMorePost && <ActivityIndicator style={styles.spinner} size={32} color="#3A8DF8" />
          }
          refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
        />
      </View>
    </LinearGradient>
  );
}

const renderItem = ({ item }) => (
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

  border: {
    height: 2,
    backgroundColor: "#ced4da",

  },
});

export default CommunityScreen;
