import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { Image } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import IconRightButton from "../../components/Community/IconRightButton";
import { updatePost } from "../../lib/post";
import events from "../../lib/events";

// 게시글 수정 화면

function ModifyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  // 라우트 파라미터의 description을 초깃값으로 사용
  const [title, setTitle] = useState(params.title);
  const [description, setDescription] = useState(params.description);
  const [photo, setPhoto] = useState(params.photoURL);
  const { width } = useWindowDimensions();

  // 수정 등록 함수
  const onSubmit = useCallback(async () => {
    await updatePost({
      id: params.id,
      title,
      description,
    });
    //포스트 및 포스트 목록 업데이트
    events.emit("updatePost", {
      postId: params.id,
      title,
      description,
    });
    navigation.pop();
  }, [navigation, params.id, title, description]);

  // 헤더 우측의 버튼
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" color="#3A8DF8"/>,
    });
  }, [navigation, onSubmit]);

  return (
    <ScrollView style={{backgroundColor: "#F6FAFF"}}>
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "height" })}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 88,
      })}
    >
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 입력하세요..."
        onChangeText={setTitle}
        value={title}
        returnKeyType="next"     
      />

      <View style={{width: "100%", height: "1%"}}>
        <View style={[styles.border]} />
      </View>

      <View style={styles.imageView}>
        <Image
          source={{uri : photo}}
          style={styles.image}
        />
      </View>

      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="이 사진에 대한 설명을 입력하세요..."
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    margin: 10,
  },

  border: {
    height: 2,
    marginBottom: 5,
    backgroundColor: "#C0CDDF",
  },

  imageView: {
    height: "67%", 
    width: "50%",
    marginTop: 5,
    marginRight: 10,
  },

  image: {
    aspectRatio: 1,
  },

  titleInput: {
    paddingVertical: 5,
    fontSize: 16,
  },

  input: {
    fontSize: 16,
  },
});

export default ModifyScreen;
