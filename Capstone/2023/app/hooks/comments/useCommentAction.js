import { useState } from "react";
import { ActionSheetIOS, Platform } from "react-native";
import { removeComment } from "../../lib/comment";
import { useNavigation, useRoute } from "@react-navigation/native";
import events from "../../lib/events";

//hooks 내부 파일은 사용하기 편하게 하기위한 form 을 생성한 것
// 댓글을 달 때 사용하는 행동

export default function useCommentActions({ id, comment }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const remove = async () => {
    //댓글을 지우면 자동 새로고침
    await removeComment(id);
    events.emit("removeComment", id);
  };

  //modal을 띄워주는 함수
  const onPressMore = () => {
    if (Platform.OS === "android") {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["댓글 삭제", "취소"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            edit();
          } else if (buttonIndex === 1) {
            remove();
          }
        }
      );
    }
  };

  const actions = [
    {
      icon: "delete",
      text: "댓글 삭제",
      onPress: remove,
    },
  ];

  const onClose = () => {
    setIsSelecting(false);
  };

  return {
    isSelecting,
    onPressMore,
    onClose,
    actions,
  };
}
