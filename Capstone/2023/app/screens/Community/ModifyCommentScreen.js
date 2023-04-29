import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { Image } from "react-native";
import {
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import IconRightButton from "../../components/Community/IconRightButton";
import { updateComment } from "../../lib/comment";
import events from "../../lib/events";

//사용하지 않음 - 댓글 수정 기능

function ModifyCommentScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  // 라우트 파라미터의 description을 초깃값으로 사용
  const [comment, setComment] = useState(params.comment);

  const { width } = useWindowDimensions();

  const onSubmit = useCallback(async () => {
    await updateComment({
      id: params.id,
      comment,
    });
    //포스트 및 포스트 목록 업데이트
    events.emit("updateComment", {
      postId: params.id,
      comment,
    });
    navigation.pop();
  }, [navigation, params.id, comment]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "height" })}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 88,
      })}
    >
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="수정할 댓글을 입력하세요..."
        textAlignVertical="top"
        value={comment}
        onChangeText={setComment}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    margin: 10,
  },
  image: { width: "100%" },
  titleInput: {
    paddingVertical: 0,
    // flex: 1,
    fontSize: 20,
    // paddingBottom: 1,
    color: "#263238",
    fontWeight: "bold",
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default ModifyCommentScreen;
