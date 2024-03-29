import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable, Dimensions, useWindowDimensions } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import usePostActions from "../../hooks/posts/usePostAciton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";
import ActionSheetModal from "../ActionSheetModal";

// 게시글을 렌더링하기 위해 사용
// BoardScreen에서 사용
import LinearGradient from "react-native-linear-gradient";
import AutoHeightImage from "react-native-auto-height-image";

function DetailPostCards({ user, category, title, photoURL, description, createdAt, id }) {
  // route에서 post에 대한 파라미터를 불러온다.
  const { user: me } = useUserContext();
  const { width } = useWindowDimensions();

  //me.id ( 현재 로그인 되어있는 세션) 와 user.id (게시글의 주인)
  //을 비교하여 isMyPost 에 내 게시물인지 bool 형태로 저장
  const isMyPost = me.id === user.id;

  // 표기하기 위한 게시글 불러오기, actions 는  ActionSheetModal 에 쓰인다.
  const { isSelecting, onPressMore, onClose, actions } = usePostActions({
    id: id,
    description: description,
    title: title,
    photoURL: photoURL,
  });

  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : null),
    [createdAt]
  );

  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };

  return (
    <>
    <LinearGradient
      colors={['#F6FAFF', '#F6FAFF']}
      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.block}>
        <View style={styles.head}>
          {/* 프로필 정보 및 제목이 들어가는 공간 */}
          <Pressable style={styles.profile} onPress={onOpenProfile}>
            <Image
              source={user.photoURL ? { uri: user.photoURL } : require("../../assets/user.png")}
              resizeMode="cover"
              style={styles.avatar}
            />
            <View style={{flexDirection: "column"}}>
              <Text style={styles.displayName}>{user.displayName}</Text>
              {
                date === null ? (
                  <Text></Text>
                ) : (
                  <Text date={date} style={styles.date}>
                    {format(date, "MM/dd hh:mm", { locale: ko })}
                  </Text>
                )
              }
              
            </View>
          </Pressable>

          {/* 게시글 수정 or 삭제 버튼 */}
          {isMyPost && (
            <Pressable
              style={{ marginBottom: 7, alignSelf: "flex-end" }}
              onPress={onPressMore}
              hitSlop={8}
            >
              <Icon name="more-vert" size={24} />
            </Pressable>
          )}
        </View>
        
        <View style={{flexDirection: "row"}}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <Text style={styles.boardTitle}>{title}</Text>
        </View>

        <View style={{width: "100%"}}>
          <View style={[styles.border]} />
        </View>

        {/* 게시글 사진 */}
        <AutoHeightImage
          width={width-20}
          source={{ uri: photoURL }}
          style={{marginTop: 3}}
        />
        {/* 게시글 내용 */}
        <Text style={styles.description}>{description}</Text>
        
      </View>
      {/* 게시글 수정 및 삭제 버튼이 있는 Modal, 아래 함수의 파라미터는 56번째 usePostAction() 부분을 참고하면 된다. */}
      <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
    </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({
  block: {
    // margin: 10,
    
  },

  border: {
    height: 2,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#C0CDDF",
  },

  paddingBlock: {
    paddingHorizontal: 0,
  },

  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
  },

  displayName: {
    top: 1,
    left: 8,

    fontSize: 16,
    fontWeight: "bold",
    color: "#282828",
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#3A8DF8",
  },

  boardTitle: {
    marginLeft: 7,
    fontSize: 16,
    fontWeight: "bold",
    color: "#282828",
  },

  date: {
    bottom: 4,
    left: 8,
    color: "#686868",
    fontSize: 12,
  },

  image: {
    // height: 300,
    width: "100%",
    aspectRatio: 1,
    marginBottom: 10,
    alignSelf: "center",
  },

  description: {
    marginTop: 5,

    fontSize: 16,
    color: "#282828",
  },
});

export default React.memo(DetailPostCards);
