import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import CheckList from "./CheckList";
import ActionSheetModal from "../ActionSheetModal";

// 진단 시작하기 버튼을 누르면 나오는 Modal

const imagePickerOption = {
  mediaType: "photo",
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === "android",
};

function PreDiagList(props) {
  const onCropImage = (res) => {
    if (res.didCancel || !res) {
      return;
    }
    props.setSelectedImage(res);
    console.log(res);
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
          .then(onCropImage)
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  // 이미지 선택 함수
  const onLaunchImageLibrary = () => {
    ImagePicker.openPicker(imagePickerOption)
      .then((image) => {
        ImagePicker.openCropper({
          path: image.path,
          width: image.width,
          height: image.height,
        })
          .then(onCropImage)
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  

  // 모달 표시 여부
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <CheckList setModalVisible={setModalVisible} />
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
    </View>
  );
}

const styles = StyleSheet.create({

});

export default PreDiagList;
