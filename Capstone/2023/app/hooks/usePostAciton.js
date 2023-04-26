import {useState} from 'react';
import {ActionSheetIOS, Platform} from 'react-native';
import { removePost } from '../lib/post';
import {useNavigation, useRoute} from '@react-navigation/native';
import events from '../lib/events';

export default function usePostActions({id,title,photoURL, description}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const edit = () => {
    navigation.navigate('Modify', {
      id,
      title,
      photoURL,
      description,
    });
  };
  const remove = async () => {
    await removePost(id);

    // 현재 단일 포스트 조회 화면이라면 뒤로가기
    if (route.name === 'Board') {
      navigation.pop();
    }

    events.emit('removePost', id);
  };

  const onPressMore = () => {
    if (Platform.OS === 'android') {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['게시글 수정', '게시물 삭제', '취소'],
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
      icon: 'edit',
      text: '게시글 수정',
      onPress: edit,
    },
    {
      icon: 'delete',
      text: '게시물 삭제',
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