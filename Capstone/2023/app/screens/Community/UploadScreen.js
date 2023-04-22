import React, {useEffect, useRef, useState, useCallback} from 'react';
import { Text } from 'react-native';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  useWindowDimensions,
  Platform
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import IconRightButton from '../../components/Community/IconRightButton';
import { useUserContext } from '../../contexts/UserContext';
import { v4 } from 'uuid';
import { createPost } from '../../lib/post';
import storage from '@react-native-firebase/storage'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import RNFS from "react-native-fs"
import RNPickerSelect from 'react-native-picker-select'
import {Picker} from '@react-native-picker/picker'

// CameraButton 에 Modal 에서 이미지를 선택하면 나오는 게시글 작성 화면
// DiagnosisScreen.js 에서 상담 게시판을 올리는데 사용

function UploadScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const res = route.params.res;
  const {width} = useWindowDimensions();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  
  const isSolution = route.params.isSolution;
  const [category, setCategory] = useState(isSolution ? "상담" : "자유");
  // console.log(isSolution)
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  console.log(res.path.split('.'))
  
//   const onSubmit = useCallback(() => {
//     // TODO: 포스트 작성 로직 구현
//   }, []);
  // console.log('route.params:', route.params.res);
  // console.log('Res',res.assets[0])

  const {user} = useUserContext();
  const onSubmit = useCallback(async () => {
    navigation.pop();
    if( !isSolution ) {
      const asset = res.assets[0];
      const extension = asset.fileName.split('.').pop();
      console.log('extension : ',extension)
      // firebase storge 에서 /photo/uid/랜덤변수.확장자 링크?
      var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);
      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }
    } else {
      const extension = res.path.split('.').pop();
      console.log('extension : ',extension)
      var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);
      //image : path to base64 변환
      const image = await RNFS.readFile(res.path, 'base64');
      if (Platform.OS === 'android') {
        await reference.putString(image, 'base64', {
          contentType: res.mime,
        });
      } else {
        await reference.putFile(res.path);
      }
    }
    // reference 에서 getDownloadURL 함수를 통해 이미지 path 저장
    const photoURL = await reference.getDownloadURL();
    console.log('photourl : ',photoURL)
    await createPost({title,category,description, photoURL, user});
    // TODO: 포스트 목록 새로고침
  }, [res, user, title,category,description, navigation]);


  // navigation.setOptions 의 파라미터로 headerRight 설정 : IconRightButton.js 참조
  // header 부분의 오른쪽 UI
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'height'})}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 180,
      })}>
      <Picker
        ref={pickerRef}
        selectedValue={category}
      
        onValueChange={(itemValue, itemIndex) =>
          setCategory(itemValue)
        }>
        <Picker.Item label="자유" value="자유" />
        <Picker.Item label="상담" value="상담" />
      </Picker>

      <TextInput
        style={styles.titleinput}
        placeholder="제목을 입력하세요..."
        returnKeyType="next"
        textAlignVertical="top"
        value={title}
        onChangeText={setTitle}
      />
      <Image
        source= {{
          uri: isSolution ? res.path : res.assets[0]?.uri
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
  },
  image: {width: '100%'},
  titleInput: {
    paddingVertical: 0,
    flex: 1,
    fontSize: 30,
    paddingBottom: 16,
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

export default UploadScreen;