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
    <View style={styles.block}>
      <View style={styles.paddingBlock}>
        <Pressable onPress={onOpenBoard}>
          <View style={styles.head}>
            <Image
              source={{ uri: photoURL }}
              style={styles.image}
              resizeMethod="resize"
              resizeMode="cover"
            />
            {/* 카테고리 여부에 따라 다르게 표기 */}
            <View>
              {category ? (
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.boardTitle}>
                  {category} {title}
                </Text>
              ) : (
                <Text style={styles.boardTitle}>[없음] {title}</Text>
              )}
              {/* 게시글 내용 */}
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>
                {description}
              </Text>
            </View>
          </View>
        </Pressable>
        {/* 프사 + 닉네임 + date */}
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
      </View>
      <View style={styles.border} />
    </View>
  );
}
const styles = StyleSheet.create({
  block: {
    // paddingTop: 16,
    // paddingBottom: 16,
  },
  border: {
    height: 1,
    backgroundColor: "gray",
    // marginBottom: 10,
    marginLeft: 10,
    marginRight: 20,
  },
  avatar: {
    width: 15,
    height: 15,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 6,
    // marginBotton: 20,
    // paddingBotton: 14,
  },
  tail: {
    flexDirection: "row",
    marginBottom: 10,
  },
  profile: {
    flexDirection: "row",
    // alignItems: 'center',
  },
  displayName: {
    // lineHeight: 20,
    fontSize: 13,
    marginLeft: 3,
    fontWeight: "bold",
    justifyContent: "space-between",
  },
  boardTitle: {
    // lineHeight: 20,
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "bold",
  },
  image: {
    backgroundColor: "#bdbdbd",
    width: "20%",
    aspectRatio: 1,
    // marginBottom: 6,
    // marginTop: 6,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    // lineHeight: 24,
    marginLeft: 8,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 14,
  },
});

export default React.memo(PostCard);
