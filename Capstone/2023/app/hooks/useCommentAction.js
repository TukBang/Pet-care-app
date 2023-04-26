import {useState} from 'react';
import {ActionSheetIOS, Platform} from 'react-native';
import { removeComment } from '../lib/comment';
import {useNavigation, useRoute} from '@react-navigation/native';
import events from '../lib/events';

export default function useCommentActions({id,comment}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const remove = async () => {
    await removeComment(id);

    // 현재 단일 포스트 조회 화면이라면 뒤로가기
    if (route.name === 'Board') {
    //   navigation.pop();
    }

    events.emit('removeComment', id);
  };

  const onPressMore = () => {
    if (Platform.OS === 'android') {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['댓글 삭제', '취소'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            edit();
          } else if (buttonIndex === 1) {
            remove();
          }
        },
      );
    }
  };

  const actions = [

    {
      icon: 'delete',
      text: '댓글 삭제',
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