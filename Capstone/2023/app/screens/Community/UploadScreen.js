import React, {
  useEffect,
  useRef, 
  useState, 
  useCallback
} from 'react';

import {
  ActivityIndicator,
  Modal,
  Text,
  StyleSheet,
  TextInput,
  View,
  Image,
  useWindowDimensions,
  Platform
} from 'react-native';

import {
  useNavigation, 
  useRoute
} from '@react-navigation/native';

import IconRightButton from '../../components/Community/IconRightButton';
import { useUserContext } from '../../contexts/UserContext';
import { v4 } from 'uuid';
import { createPost } from '../../lib/post';
import storage from '@react-native-firebase/storage'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import RNFS from "react-native-fs"
import {Picker} from '@react-native-picker/picker'
import EndModal from '../../components/Community/EndModal';
import { CommonActions } from '@react-navigation/native';
import events from '../../lib/events';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

// CameraButton 에 Modal 에서 이미지를 선택하면 나오는 게시글 작성 화면
// DiagnosisScreen.js 에서 상담 게시판을 올리는데 사용

function UploadScreen() {
  let titlePlaceHolder = "제목"
  let bodyPlaceHolder = "내용 입력"
  let placeholderTextColor = "#BCBCBC"

  const route = useRoute();
  const navigation = useNavigation();
  const res = route.params.res;
  const {width} = useWindowDimensions();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSolution = route.params.isSolution;
  const [category, setCategory] = useState(isSolution ? "상담" : "자유");
  const pickerRef = useRef();

  const {user} = useUserContext();
  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    if( !isSolution ) {
      const asset = res.assets[0];
      const extension = asset.fileName.split('.').pop();

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
      var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);
      
      //image : path to base64 변환
      const image = await RNFS.readFile(res.path, 'base64');
      if (Platform.OS === 'android') {
        await reference.putString(image, 'base64', {contentType: res.mime});
      } else {
        await reference.putFile(res.path);
      }
    }
  
    // reference 에서 getDownloadURL 함수를 통해 이미지 path 저장
    const photoURL = await reference.getDownloadURL();
    try {
      await createPost({title,category,description, photoURL, user});
      setIsLoading(false);
      
      if (isSolution) {
        setEndModalVisible(true);
      } else {
        navigation.pop()
      }
    } catch (error) {}

    // TODO: 포스트 목록 새로고침
    events.emit('refresh');
  }, [res, user, title, category, description, navigation]);

  const onCloseModal = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  }, [navigation]);

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
        style={styles.titleTextInput}
        placeholder={titlePlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setTitle}
        value={title}
        returnKeyType="next"
      />

      <Image
        source= {{
          uri: isSolution ? res.path : res.assets[0]?.uri
        }}
        style={styles.image}
        resizeMode="contain"
        transform={[{scale: 1}]}
      />
      <TextInput
        style={styles.bodyTextInput}
        placeholder={bodyPlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setDescription}
        value={description}
        multiline={true}
      />
      
      
      {isLoading && (
        <Modal
          transparent={true}
          animationType='fade'
        >
          <Pressable style={styles.background}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          </Pressable>
        </Modal>
      )}
      <EndModal visible={endModalVisible} onClose={onCloseModal} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },

  titleTextInput: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    
    // 밑줄
    borderBottomWidth: 2,
    borderBottomColor: '#FFA000',
    
    fontWeight: 'bold',
    fontSize: 18,
  },

  container: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#FFA000",
  },

  image: {
    marginLeft: 15,
    height: "50%",
    width: '50%'
  },

  bodyTextInput: {
    textAlignVertical: "top",
    marginLeft: 10,
    paddingVertical: 5,
    height: 200,
    fontSize: 16,
  },
  
  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default UploadScreen;