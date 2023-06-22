import React, { useState, useRef, useEffect } from "react";

import { View, Pressable, StyleSheet, Platform, ActionSheetIOS, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

import ActionSheetModal from "../ActionSheetModal";
import ImagePicker from "react-native-image-crop-picker";

const imagePickerOption = {
  mediaType: "photo",
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === "android",
};

// CommunityScreen 에서 게시물 추가하기 위한 모달을 띄우는데 사용
function CameraButton({setBoardCategory}) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const animation = useRef(new Animated.Value(0)).current;
  // Animation for Pressable Button
  useEffect(() => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 45,
      friction: 5,
    }).start();
  }, [animation]);

  const onPickedImage = (res) => {
    if (res.didCancel || !res) {
      return;
    }
    navigation.push("Upload", { res, setBoardCategory, isSolution: false });
  };

  // 카메라 실행 함수
  const onLaunchCamera = () => {
    ImagePicker.openCamera(imagePickerOption)
      .then((image) => {
        ImagePicker.openCropper({
          path: image.path,
          width: image.width,
          height: image.height,
        })
          .then(onPickedImage)
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const onLaunchImageLibrary = () => {
    ImagePicker.openPicker(imagePickerOption)
      .then((image) => {
        ImagePicker.openCropper({
          path: image.path,
          width: image.width,
          height: image.height,
        })
          .then(onPickedImage)
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {/* 버튼 클릭시 나타나는 애니메이션 */}
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 88],
                }),
              },
            ],

            opacity: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        {/* 모달 표시 */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            Platform.OS === "ios" && {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          android_ripple={{ color: "white" }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon name="add" size={24} style={{ color: "white" }} />
        </Pressable>
      </Animated.View>
      {/* 카메라-사진 모달 */}
      <ActionSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={[
          {
            icon: "camera-alt",
            text: "카메라로 촬영하기",
            onPress: onLaunchCamera,
          },
          {
            icon: "photo",
            text: "사진 선택하기",
            onPress: onLaunchImageLibrary,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 58,
    height: 58,
    borderRadius: 28,

    zIndex: 5,

    shadowColor: "#4D4D4D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

    overflow: Platform.select({ android: "hidden" }),
  },

  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3A8DF0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraButton;
