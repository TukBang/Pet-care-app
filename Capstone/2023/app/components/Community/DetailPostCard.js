import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import usePostActions from "../../hooks/usePostAciton";
import Icon from "react-native-vector-icons/MaterialIcons";
import ko from "date-fns/locale/ko";
import { format, formatDistanceToNow } from "date-fns";
import ActionSheetModal from "../ActionSheetModal";

// 게시글을 렌더링하기 위해 사용
// BoardScreen에서 사용

function DetailPostCards({ user, category, title, photoURL, description, createdAt, id }) {
  // route에서 post에 대한 파라미터를 불러온다.
  const { user: me } = useUserContext();

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
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );

  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };

  return (
    <>
      <View style={styles.block}>
        <View style={styles.head}>
          {/* 프로필 정보 및 제목이 들어가는 공간 */}
          <Pressable style={styles.profile} onPress={onOpenProfile}>
            <Image
              source={user.photoURL ? { uri: user.photoURL } : require("../../assets/user.png")}
              resizeMode="cover"
              style={styles.avatar}
            />
            <Text style={styles.displayName}>{user.displayName + " 님"}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.boardTitle}>
              {"[" + category + "] - "}
              {title}
            </Text>
          </Pressable>
          {/* 게시글 수정 or 삭제 버튼 */}
          {isMyPost && (
            <Pressable
              style={{ marginBottom: 3, alignSelf: "flex-end" }}
              onPress={onPressMore}
              hitSlop={8}
            >
              <Icon name="more-vert" size={24} />
            </Pressable>
          )}
        </View>
        {/* 게시시간 */}
        <Text date={date} style={styles.date}>
          {format(date, "MM월 dd일 (EEE) hh시 mm분", { locale: ko })}에 작성됨
        </Text>
        {/* 게시글 사진 */}
        <Image
          source={{ uri: photoURL }}
          style={styles.image}
          resizeMode="contain"
          transform={[{ scale: 1 }]}
        />
        {/* 게시글 내용 */}
        <Text style={styles.description}>{description}</Text>
      </View>
      {/* 게시글 수정 및 삭제 버튼이 있는 Modal, 아래 함수의 파라미터는 56번째 usePostAction() 부분을 참고하면 된다. */}
      <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
    </>
  );
}
const styles = StyleSheet.create({
  block: {
    margin: 10,
    // flex: 1,
    // paddingBottom: 16,
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
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
  },

  displayName: {
    lineHeight: 20,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },

  boardTitle: {
    lineHeight: 20,
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },

  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 20,
    marginTop: 5,
    marginLeft: 3,
    marginBottom: 10,
  },

  image: {
    height: "60%",
    width: "60%",
    aspectRatio: 1,

    // marginTop: 5,
    // marginBottom: 10,

    alignSelf: "center",
  },

  description: {
    fontSize: 16,
    // lineHeight: 24,
    marginBottom: 8,
  }
});

export default React.memo(DetailPostCards);
