import {ActivityIndicator,View, FlatList, StyleSheet,RefreshControl} from 'react-native';
import CameraButton from "../../components/Community/CameraButton";
import React, {useEffect, useState} from 'react';
import PostCard from "../../components/Community/PostCard";
import { getOlderPosts, getPosts, PAGE_SIZE,getNewerPosts } from "../../lib/post";


function CommunityScreen() {

  const [posts, setPosts] = useState(null);
  const [noMorePost, setNoMorePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 포스트 목록을 조회한 후 `posts` 상태에 담기
    getPosts().then(setPosts);
  }, []);

  // Page size 이후 글을 확인하려고 할 때 사용
  const onLoadMore = async () => {
    if (noMorePost || !posts || posts.length < PAGE_SIZE) {
      return;
    }
    const lastPost = posts[posts.length - 1];
    const olderPosts = await getOlderPosts(lastPost.id);
    if (olderPosts.length < PAGE_SIZE) {
      setNoMorePost(true);
    }
    setPosts(posts.concat(olderPosts));
  };

  // 새로고침에 사용
  const onRefresh = async () => {
    if (!posts || posts.length === 0 || refreshing) {
      return;
    }
    const firstPost = posts[0];
    setRefreshing(true);
    const newerPosts = await getNewerPosts(firstPost.id);
    setRefreshing(false);
    if (newerPosts.length === 0) {
      return;
    }
    setPosts(newerPosts.concat(posts));
  };



    return (
      <>
        <View style={styles.block}>
          <CameraButton />
          <FlatList
            data={posts}
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
    )
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













// import React from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
// import Ggupdeagi from "../Ggupdeagi";
// import { Image } from "react-native";



// function CommunityScreen() {

//   const {user} = useUserContext();
//     return (
//     <View style={styles.block}>
//       <View style={{flexDirection: 'row',justifyContent: 'space-around'}} >
//         <Text style={styles.text}>안녕하세요. {user.displayName}님!</Text>
//         {user.photoURL && (
//           <Image
//             source={{uri: user.photoURL}}
//             style={{width: 64, height: 64, marginBottom: 0}}
//             resizeMode="cover"
//           />
//         )}
//       </View>
      
//       <Ggupdeagi />

      
//     </View>
//     )
// }

// const styles = StyleSheet.create({
//     block: {},
//     text: {
//       fontSize: 25,
//       padding: 15,
//       color: 'black'
//     }
// });

// export default CommunityScreen;



// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import AsyncStorage from "@react-native-community/async-storage";

// const CommunityScreen = () => {
//   const [selectedDate, setSelectedDate] = useState('');
//   const [memos, setMemos] = useState([]);
//   const [newMemo, setNewMemo] = useState('');

//   const addMemo = async (memo, date) => {
//     try {
//       const savedMemos = await AsyncStorage.getItem('memos');
//       const memos = savedMemos ? JSON.parse(savedMemos) : {};

//       if (!memos[date]) {
//         memos[date] = [];
//       }
//       memos[date].push(memo);

//       await AsyncStorage.setItem('memos', JSON.stringify(memos));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const getMemos = async (date) => {
//     try {
//       const savedMemos = await AsyncStorage.getItem('memos');
//       const memos = savedMemos ? JSON.parse(savedMemos) : {};

//       return memos[date] || [];
//     } catch (e) {
//       console.error(e);
//       return [];
//     }
//   };

//   const clearMemos = async () => {
//     try {
//       await AsyncStorage.removeItem('memos');
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const onDayPress = async (day) => {
//     setSelectedDate(day.dateString);

//     const memos = await getMemos(day.dateString);
//     setMemos(memos);
//   };

//   const addMemoButtonPressed = async () => {
//     if (!selectedDate) return;

//     await addMemo(newMemo, selectedDate);
//     const memos = await getMemos(selectedDate);
//     setMemos(memos);
//     setNewMemo('');
//   };

//   return (
//     <View style={styles.container}>
//       <Calendar onDayPress={onDayPress} />
//       <Text style={styles.dateText}>{selectedDate}</Text>
//       <TextInput
//         style={styles.memoInput}
//         multiline={true}
//         onChangeText={(text) => setNewMemo(text)}
//         value={newMemo}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={addMemoButtonPressed}>
//         <Text style={styles.addButtonText}>Add Memo</Text>
//       </TouchableOpacity>
//       <View style={styles.memoList}>
//         {memos.map((memo, index) => (
//           <Text style={styles.memoItem} key={index}>
//             {memo}
//           </Text>
//         ))}
//       </View>
//       <TouchableOpacity style={styles.clearButton} onPress={clearMemos}>
//         <Text style={styles.clearButtonText}>Clear Memos</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = {
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   dateText: {
//     marginTop: 20,
//     fontSize: 20,
//   },
//   memoInput: {
//     width: '80%',
//     height: 100,
//     borderWidth: 1,
//     borderColor: 'gray',
//     marginTop: 20,
//     padding: 10,
//   },
//   addButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   memoList: {
//     marginTop: 20,
//     width: '80%',
//   },
//   memoItem: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     padding: 10,
//     marginTop: 10,
//   },
//   clearButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   clearButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// };

// export default CommunityScreen;