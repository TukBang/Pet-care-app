import { useState } from "react";
import { ActionSheetIOS, Platform } from "react-native";
import { removePost } from "../../lib/post";
import { useNavigation, useRoute } from "@react-navigation/native";
import events from "../../lib/events";

//hooks 내부 파일은 사용하기 편하게 하기위한 form 을 생성한 것
// 게시글을 달 때 사용하는 행동

export default function usePostActions({ id, title, photoURL, description }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  //게시글 관리 모달
  const onPressMore = () => {
    if (Platform.OS === "android") {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["게시글 수정", "게시물 삭제", "취소"],
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
      icon: "edit",
      text: "게시글 수정",
      onPress: edit,
    },
    {
      icon: "delete",
      text: "게시물 삭제",
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
