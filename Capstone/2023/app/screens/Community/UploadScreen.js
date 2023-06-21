import React, { useEffect, useRef, useState, useCallback } from "react";

import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  View,
  Image,
  useWindowDimensions,
  Platform,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import IconRightButton from "../../components/Community/IconRightButton";
import { useUserContext } from "../../contexts/UserContext";
import { v4 } from "uuid";
import { createPost } from "../../lib/post";
import storage from "@react-native-firebase/storage";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import RNFS from "react-native-fs";
import AutoHeightImage from "react-native-auto-height-image";
import { Picker } from "@react-native-picker/picker";
import EndModal from "../../components/Diagnosis/EndModal";
import { CommonActions } from "@react-navigation/native";
import events from "../../lib/events";

// CameraButton 에 Modal 에서 이미지를 선택하면 나오는 게시글 작성 화면
// DiagnosisScreen.js 에서 상담 게시판을 올리는데 사용

function UploadScreen() {
  let titlePlaceHolder = "제목";
  let bodyPlaceHolder = "내용 입력";
  let placeholderTextColor = "#BCBCBC";

  const route = useRoute();
  const navigation = useNavigation();
  const res = route.params.res;
  const predictions = route.params.predictions;
  const { width } = useWindowDimensions();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSolution = route.params.isSolution;
  const [category, setCategory] = useState(isSolution ? "상담" : "자유");
  const pickerRef = useRef();

  const { user } = useUserContext();

  console.log(res);
  console.log("Hello World!");
  console.log(predictions);
  const onSubmit = useCallback(async () => {
    if (title === "" || title === null) {
      Alert.alert("실패", "제목을 입력해주세요.");
      return;
    }
    if (description === "" || description === null) {
      Alert.alert("실패", "내용을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    if (!isSolution) {
      const asset = res.assets[0];
      const extension = asset.fileName.split(".").pop();

      // firebase storge 에서 /photo/uid/랜덤변수.확장자 링크?
      var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);
      if (Platform.OS === "android") {
        await reference.putString(asset.base64, "base64", {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }
    } else {
      const extension = res.path.split(".").pop();
      var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);

      //image : path to base64 변환
      const image = await RNFS.readFile(res.path, "base64");
      if (Platform.OS === "android") {
        await reference.putString(image, "base64", { contentType: res.mime });
      } else {
        await reference.putFile(res.path);
      }
    }

    // reference 에서 getDownloadURL 함수를 통해 이미지 path 저장
    const photoURL = await reference.getDownloadURL();
    try {
      await createPost({ title, category, description, photoURL, user });
      setIsLoading(false);

      if (isSolution) {
        setEndModalVisible(true);
      } else {
        navigation.pop();
      }
    } catch (error) {}

    // TODO: 포스트 목록 새로고침
    events.emit("refresh");
  }, [res, user, title, category, description, navigation]);

  const onCloseModal = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
  }, [navigation]);

  // navigation.setOptions 의 파라미터로 headerRight 설정 : IconRightButton.js 참조
  // header 부분의 오른쪽 UI
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" color="#3A8DF8"/>,
    });
  }, [navigation, onSubmit]);

  return (
    <ScrollView style={{backgroundColor: "#F6FAFF"}}>
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "height" })}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 180,
      })}
    >
      <Picker
        ref={pickerRef}
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        style={{width:"108%", right: 13}}
      >
        <Picker.Item label="자유" value="자유" style={{fontSize: 18}}/>
        <Picker.Item label="상담" value="상담" style={{fontSize: 18}}/>
      </Picker>

      <TextInput
        style={styles.titleTextInput}
        placeholder={titlePlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setTitle}
        value={title}
        returnKeyType="next"
      />

      <View style={{width: "100%", height: "1%"}}>
        <View style={[styles.border]} />
      </View>
      
      <View style={styles.imageView}>
        <Image
          source={{uri : isSolution ? res.path : res.assets[0]?.uri}}
          style={styles.image}
        />
      </View>

      <TextInput
        style={styles.bodyTextInput}
        placeholder={bodyPlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setDescription}
        value={description}
        multiline={true}
      />

      {isLoading && (
        <Modal transparent={true} animationType="fade">
          <Pressable style={styles.background}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#3A8DF8" />
            </View>
          </Pressable>
        </Modal>
      )}
      <EndModal visible={endModalVisible} onClose={onCloseModal} />

    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "#F6FAFF",
    paddingHorizontal: 10
  },

  border: {
    height: 2,
    marginBottom: 5,
    backgroundColor: "#C0CDDF",
  },

  titleTextInput: {
    paddingVertical: 5,
    fontSize: 16,
  },

  imageView: {
    height: "38%", 
    width: "50%",
    marginTop: 5,
    marginRight: 10,
  },

  image: {
    aspectRatio: 1,
  },

  bodyTextInput: {
    textAlignVertical: "top",
    height: 200,
    marginTop: 3,    
    fontSize: 16,
  },

  background: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UploadScreen;
