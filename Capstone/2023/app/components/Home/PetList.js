import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Pressable,
  Animated,
} from "react-native";
// 아이콘 받기위해 사용
import Icon from "react-native-vector-icons/MaterialIcons";
// 펫 정보 firebase에 저장
import { createPetInfo } from "../../lib/petInfo";
// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";
// 펫 정보 삭제를 위해 사용
import { deletePetInfo } from "../../lib/petInfo";
// user uid 를 위해 사용
import { useUserContext } from "../../contexts/UserContext";
// 화면이동을 위해 사용
import { useNavigation } from "@react-navigation/native";
// 이미지피커
import ImagePicker from "react-native-image-crop-picker";
import ActionSheetModal from "../ActionSheetModal";

import storage from "@react-native-firebase/storage";
import { v4 } from "uuid";
import RNFS from "react-native-fs";

function PetList() {
  const { user } = useUserContext();
  const uid = user["id"];
  const [petInfo, setPetInfo] = useState({
    petName: "",
    petAge: "",
    petWeight: "",
    petGender: "",
    petKind: "",
    petImage: "",
  });
  const [showModal, setShowModal] = useState(false);
  // 펫 정보 불러오기 위함
  const [petList, setPetList] = useState([]);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  // 카메라 경로저장 변수
  const [cameraInfo, setCameraInfo] = useState(null);

  // 펫 정보 불러오기
  useEffect(() => {
    if (user) {
      // uid를 통해서 펫 정보 가져옴
      getPetInfoByUserID(uid)
        .then((pets) => {
          // createdAt 값이 null인 경우를 대비하여 예외처리 추가 (에러방지)
          // 펫 정보 오름차순 정렬
          const sortedPets = pets.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : 0;
            const dateB = b.createdAt ? b.createdAt.toDate() : 0;
            return dateA - dateB;
          });

          setPetList(sortedPets);
        })
        .catch((error) => console.error("펫 정보 불러오기 실패", error));
    }
  }, [user, petList]);

  // 펫 정보 저장하기
  const handleSavePetInfo = async () => {

    const extension = cameraInfo.path.split(".").pop();
    var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);

    //image : path to base64 변환
    const image = await RNFS.readFile(cameraInfo.path, "base64");
    if (Platform.OS === "android") {
      await reference.putString(image, "base64", { contentType: cameraInfo.mime });
    } else {
      await reference.putFile(cameraInfo.path);
    }
    const petImage = await reference.getDownloadURL();

    console.log(extension);
    console.log(reference);
    console.log(petImage);

    createPetInfo({ ...petInfo, userID: uid , petImage: petImage })
      .then(() => {
        console.log("펫 정보 저장 성공");
        // 저장 후에 최신 데이터로 업데이트
        getPetInfoByUserID(uid).then((pets) => {
          setPetList(pets);
        });
      })
      .catch((error) => {
        console.error("펫 정보 저장 실패", error);
      });

  };

  // 펫 정보 삭제하기
  const handleDeletePet = async (petID) => {
    await deletePetInfo(petID);
    setPetList(petList.filter((pet) => pet.id !== petID));
    const updatedPetList = petList.filter((pet) => pet.id !== petID);
    setPetList(updatedPetList);
  };

  // 스크롤 뷰 펫 누르면 펫 정보 띄우기
  const handlePressPet = (petId) => {
    navigation.navigate("PetProfile", { petId: petId });
  };

  const imagePickerOption = {
    mediaType: "photo",
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === "android",
  };

  const onCropImage = (res) => {
    if (res.didCancel || !res) {
      return;
    }
    
    console.log(res);
    console.log(res.path);
    setCameraInfo(res);


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
  
  // Animation for Pressable Button
  useEffect(() => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 45,
      friction: 5,
    }).start();
  }, [animation]);

  return (
    <>
      <View style={styles.petListScrollView}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {petList.map((pet) => (
            <View key={pet.id} style={styles.petInfoContainer}>
              <View style={styles.petImageContainer}>
                <TouchableOpacity onPress={() => handlePressPet(pet.id)}>
                  <Image source={pet.petImage} style={styles.petImage} />
                  <Text>
                    {pet.id}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePet(pet.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          ))}
          <View style={styles.petInfoContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* 펫 등록 화면 모달 */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <Pressable style={styles.background}>
          <View style={styles.whiteBox}>
            <Text style={styles.modalTitle}>반려동물을 등록해주세요</Text>

            <TextInput
              style={styles.modalInput}
              value={petInfo.petName}
              onChangeText={(text) => setPetInfo({ ...petInfo, petName: text })}
              placeholder="이름"
            />
            <TextInput
              style={styles.modalInput}
              value={petInfo.petGender}
              onChangeText={(text) => setPetInfo({ ...petInfo, petGender: text })}
              placeholder="성별"
            />
            <TextInput
              style={styles.modalInput}
              value={petInfo.petWeight}
              onChangeText={(text) => setPetInfo({ ...petInfo, petWeight: text })}
              placeholder="무게"
            />
            <TextInput
              style={styles.modalInput}
              value={petInfo.petAge}
              onChangeText={(text) => setPetInfo({ ...petInfo, petAge: text })}
              placeholder="나이"
            />
            <TextInput
              style={styles.modalInput}
              value={petInfo.petKind}
              onChangeText={(text) => setPetInfo({ ...petInfo, petKind: text })}
              placeholder="종류"
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}

            >
              <Image 
                style={styles.petProfile}
                resizeMode='cover' 
                source={cameraInfo ? { uri: cameraInfo.path } : require("../../assets/dog.png")}  />
            </TouchableOpacity>
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

            <View style={styles.modalButtons}>
              <Button
                title="Save"
                onPress={() => {
                  handleSavePetInfo();
                  setPetInfo({
                    petName: "",
                    petAge: "",
                    petWeight: "",
                    petGender: "",
                    petKind: "",
                  });
                  setShowModal(false);
                }}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancle"
                onPress={() => {
                  setShowModal(false);
                }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  saving: {
    marginTop: 10,
  },

  wrapper: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 58,
    height: 58,
    borderRadius: 28,

    shadowColor: "#4D4D4D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

    overflow: Platform.select({ android: "hidden" }),
  },

  addButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#BFBFBF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 50,
    textAlign: "center",
    marginTop: -5,
  },
  // 스크롤 뷰 스타일
  scrollView: {
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  petInfoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E5E5",
    marginRight: 10,
    padding: 10,
    position: "relative",
  },
  petImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "absolute",
    top: 10,
    left: 10,
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  petListScrollView: {
    flexDirection: "row-reverse",
  },
  //--------------------------------------------------------------------
  // 모달 창 스타일

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  whiteBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  modalInput: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 18,
  },
  modalButtons: {
    width: "100%",
    paddingVertical: 2,
  },
  // 펫 프로필 사진
  petProfile: {
    width: "30%",
    height: "30%",
    borderRadius: 50,
    alignSelf: "center"
  }
});
//--------------------------------------------------------------------

export default PetList;
