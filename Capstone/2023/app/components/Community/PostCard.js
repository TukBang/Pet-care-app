import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

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
      <Pressable onPress={onOpenBoard} style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View>
          <View style={styles.paddingBlock}>
            <View style={styles.profile}>
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
            </View>

            <View style={styles.head}>
              {/* 카테고리 여부에 따라 다르게 표기 */}
              <View style={styles.textContainer}>
                <View style={styles.cateContainer}>
                  <View>
                    {
                      category ? (
                        <Text style={styles.categoryTitle}>{category}</Text>
                      ) : (
                        <Text style={styles.categoryTitle}>[없음]</Text>
                      )
                    }                  
                  </View>
                  
                  <View style={{right: 4, bottom: 1.25,}}>
                    <Text style={styles.boardTitle}>{title}</Text>
                  </View>
                </View>
                
                {/* 게시글 내용 */}
                {
                  description.length > 20 ? (
                    <Text style={styles.description}>{description.slice(0, 20)}...</Text>
                  ) : (
                    <Text style={styles.description}>{description}</Text>
                  )
                }
                <Text date={date} style={styles.date}>{format(date, "MM월 dd일 hh:mm", { locale: ko })}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.imageView}>
          <Image
            source={{uri: photoURL}}
            style={styles.image}
          />
        </View>
      </Pressable>

      <View style={{width: "100%"}}>
        <View style={[styles.border]} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  border: {
    height: 2,
    marginLeft: 10,
    marginRight: 10,
    
    backgroundColor: "#C0CDDF",
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  
  paddingBlock: {
    paddingHorizontal: 10,
  },

  head: {
    marginTop: 6,
  },

  profile: {
    flex: 1,
    flexDirection: "row",

    marginTop: 10,
  },

  displayName: {
    justifyContent: "space-between",
    marginLeft: 10,
    marginTop: 2,
    fontSize: 16,
    color: "#282828",
  },

  categoryTitle: {
    flex: 1,
    marginRight: 10,

    fontSize: 16,
    fontWeight: 'bold',
    color: "#3A8DF8",
  },

  boardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#282828",
  },

  textContainer: {
    marginBottom: 7,
    paddingRight: 10,
  },

  imageView: {
    height: "25%", 
    width: "25%",
    marginRight: 10,
    marginTop: 20,
  },

  image: {
    aspectRatio: 1,
    borderRadius: 10,
    bottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#282828",
  },

  cateContainer: {
    flexDirection: 'row',
  },

  date: {
    color: "#686868",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },
});

export default React.memo(PostCard);
