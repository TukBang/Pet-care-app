import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

function PostCard({ user, category, title, photoURL, description, createdAt, id }) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );
  const navigation = useNavigation();

  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };
  // BoardScreen 으로 이동
  const onOpenBoard = () => {
    navigation.push("Board", {
      post_param: { user, category, title, photoURL, description, createdAt, id },
    });
  };

  return (
    <>
      <View style={styles.paddingBlock}>
      <View style={styles.tail}>
          <Pressable style={styles.profile} onPress={onOpenProfile}>
            <Image
              source={
                user.photoURL
                  ? {
                      uri: user.photoURL,
                    }
                  : require("../../assets/user.png")
              }
              resizeMode="cover"
              style={styles.avatar}
            />
            <Text style={styles.displayName}>{user.displayName}</Text>
          </Pressable>
          <Text date={date} style={styles.date}>
            {date.toLocaleString()}
          </Text>
        </View>
        <Pressable onPress={onOpenBoard}>
          <View style={styles.head}>
            {/* 카테고리 여부에 따라 다르게 표기 */}
            <View style={styles.textContainer}>
            <View style={styles.cateContainer}>
              <View style={styles.categoryContainer}>
                {category ? (
                  <Text numberOfLines={2} ellipsizeMode="tail" style={styles.categoryTitle}>
                    {category}
                  </Text>
                ) : (
                  <Text style={styles.categoryTitle}>[없음]</Text>
                )}
              </View>
              <View style={styles.titleContainer}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.boardTitle}>
                  {title}
                </Text>
              </View>
              </View>
              {/* 게시글 내용 */}
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>
                {description}
              </Text>
            </View>
            <Image
              source={{ uri: photoURL }}
              style={styles.image}
              resizeMethod="resize"
              resizeMode="cover"
            />

          </View>
        </Pressable>
        {/* 프사 + 닉네임 + date */}
        
      </View>
      <View style={styles.border} />
    </>
  );
}
const styles = StyleSheet.create({
  border: {
    height: 2,
    backgroundColor: "#C0CDDF",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 6,
    // marginBotton: 20,
    // paddingBotton: 14,
  },
  tail: {
    flexDirection: "row",
    marginBottom: 3,
  },
  profile: {
    flex: 1,
    marginTop: 5,
    flexDirection: "row",
    // alignItems: 'center',
  },
  displayName: {
    // lineHeight: 20,
    fontSize: 17,
    marginLeft: 3,
    fontWeight: "bold",
    justifyContent: "space-between",
    marginLeft: 10,
    marginTop: 3,
  },
  boardTitle: {
    flex: 1,
    // lineHeight: 20,
    fontSize: 18,
    // marginLeft: 3,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 3,
    paddingRight: 10,
  },
  image: {
    backgroundColor: "#bdbdbd",
    //width: "20%",
    aspectRatio: 1,
    // marginBottom: 6,
    // marginTop: 6,
    borderRadius: 10,
    flex: 1,
    resizeMode: 'cover',
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    // lineHeight: 24,
    //marginLeft: 8,
  },
  cateContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#367FAA',
    marginRight: 10,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    //lineHeight: 18,
    marginLeft: 30,
    marginTop: 12,
  },
});

export default React.memo(PostCard);
