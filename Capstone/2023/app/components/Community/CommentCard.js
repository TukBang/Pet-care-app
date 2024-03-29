import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useCommentActions from "../../hooks/comments/useCommentAction";
import ActionSheetModal from "../ActionSheetModal";
import { useUserContext } from "../../contexts/UserContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

// 댓글을 렌더링하기 위해서 사용
// BoardScreen 에서 사용

function CommentCard({ user, txt, postId, createdAt, id }) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );
  const onOpenProfile = () => {
    // TODO: 사용자 프로필 화면 열기
  };
  const { user: me } = useUserContext();
  const isMyPost = me.id === user.id;

  const { isSelecting, onPressMore, onClose, actions } = useCommentActions({
    id: id,
    comment: txt,
  });

  return (
    <>
      {/* 내용 + 보더 */}
      <View style={styles.block}>
        {/* 댓글 */}
        <View style={styles.paddingBlock}>
          <View style={styles.tail}>
            {/* 프로필 + 게시물 관리 버튼 */}
            <View style={{ flexDirection: "row" }}>
              {/* 프로필 - 프사, 닉네임 */}
              <Pressable style={styles.profile} onPress={onOpenProfile}>
                {
                  user.isExpert == 1 ? (
                    <Image
                      source={
                        user.photoURL
                        ? { uri: user.photoURL, }
                        : require("../../assets/user.png")
                      }
                      resizeMode="cover"
                      style={[styles.avatar, {borderWidth: 2, borderColor: "#DBAC34",}]}
                    />
                  ) : (
                    <Image
                      source={
                        user.photoURL
                        ? { uri: user.photoURL, }
                        : require("../../assets/user.png")
                      }
                      resizeMode="cover"
                      style={[styles.avatar]}
                    />
                  )                      
                }
                {
                  user.isExpert == 1 ? (
                    <Text style={[styles.displayName, {color: "#DBAC34"}]}>
                      {user.displayName}
                    </Text>
                  ) : (
                  <Text style={[styles.displayName]}>
                    {user.displayName}
                  </Text>
                  )
                }
              </Pressable>

              {/* 내 게시물 여부(isMyPost(bool))에 따라 게시물 관리 버튼 표시 */}
              {isMyPost && (
                <Pressable style={{ alignSelf: "flex-end" }} onPress={onPressMore} hitSlop={8}>
                  <Icon name="more-vert" size={25} />
                </Pressable>
              )}
            </View>
            
            {/* 댓글 내용 */}
            <Text style={styles.comment}>{txt}</Text>
            <Text date={date} style={styles.date}>
              {format(date, "MM/dd hh:mm", { locale: ko })}
            </Text>
          </View>
        </View>

        <View style={{width: "100%"}}>
          <View style={[styles.border]} />
        </View>

      </View>
      {/* 댓글 삭제 모달 */}
      <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
    </>
  );
}
const styles = StyleSheet.create({
  block: {
  },

  border: {
    height: 2,
    backgroundColor: "#C0CDDF",
    marginBottom: 10,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },

  paddingBlock: {
    marginBottom: 10,
    justifyContent: "center",
  },

  tail: {
    // flexDirection: 'row',
    // marginBottom: 10,
  },

  profile: {
    flexDirection: "row",
    flex: 1,
    // alignItems: 'center',
  },

  displayName: {
    justifyContent: "center",
    marginLeft: 6,
    top: 5,

    fontSize: 14,
    color: "#282828",
  },

  comment: {
    marginBottom: 2,
    fontSize: 14,
    color: "#282828",
  },

  date: {
    color: "#686868",
    fontSize: 12,
    marginLeft: 1,
  },
});

export default React.memo(CommentCard);
