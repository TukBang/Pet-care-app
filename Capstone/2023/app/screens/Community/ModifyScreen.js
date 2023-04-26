import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import { Image } from 'react-native';
import {
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import IconRightButton from '../../components/Community/IconRightButton';
import { updatePost } from '../../lib/post';
import events from '../../lib/events';

function ModifyScreen() {
  const navigation = useNavigation();
  const {params} = useRoute();
  // 라우트 파라미터의 description을 초깃값으로 사용
  const [title, setTitle] = useState(params.title);
  const [description, setDescription] = useState(params.description);
  const [photo, setPhoto] = useState(params.photoURL);
  const {width} = useWindowDimensions();

  const onSubmit = useCallback(async () => {
    await updatePost({
      id: params.id,
      title,
      description,
    });
    //포스트 및 포스트 목록 업데이트
    events.emit('updatePost', {
      postId: params.id,
      title,
      description,
    });
    navigation.pop();
  }, [navigation, params.id,title, description]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'height'})}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 88,
      })}>
    <TextInput
        style={styles.titleInput}
        multiline={true}
        placeholder="제목을 입력하세요..."
        textAlignVertical="top"
        value={title}
        onChangeText={setTitle}
      />
      <Image
        source= {{
          uri: photo
        }}
        style={[styles.image, {height: width}]}
        resizeMode="cover"
      />
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="이 사진에 대한 설명을 입력하세요..."
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    margin:10,
  },
  image: {width: '100%'},
  titleInput: {
    paddingVertical: 0,
    // flex: 1,
    fontSize: 20,
    // paddingBottom: 1,
    color: '#263238',
    fontWeight: 'bold',
},
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default ModifyScreen;