import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Text, TouchableOpacity, Image } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import CheckList from "./CheckList";
import ActionSheetModal from "../ActionSheetModal";
import { useUserContext } from "../../contexts/UserContext";

// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";

// 진단 시작하기 버튼을 누르면 나오는 Modal

const imagePickerOption = {
  mediaType: "photo",
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === "android",
};

function PreDiagList(props) {

  const { user } = useUserContext();
  const uid = user["id"];

  const petList = props.petList
  // const [selectedPet, setSelectedPet] = useState(undefined);

  
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
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectPet = (pet) => {
    props.setSelectedPet(pet);
    setPetModalVisible(false);
    setModalVisible(true)
  };
  
  return (
    <View>
      <CheckList setModalVisible={setPetModalVisible} />
      <Modal visible={petModalVisible} transparent={true} animationType="fade" onRequestClose={() => {setPetModalVisible(false)}}>
        <View style={styles.background}>
          <View style={styles.whiteBox}>
            <Text>진단하실 펫을 선택해주세요</Text>
            {petList.map((pet) => (
              <TouchableOpacity style={styles.petSelect} key={pet.id} onPress={() => onSelectPet(pet)}>
                <Image style={styles.petImage} source={{uri: pet.petImage}} />
                <Text>{pet.petName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <ActionSheetModal
        visible={modalVisible}
        onClose={() => {setModalVisible(false)}}
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
  background: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  whiteBox: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 2,
  },

  petSelect: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },

  petImage: {
    width: 30,
    height: 30,
  }
});

export default PreDiagList;
