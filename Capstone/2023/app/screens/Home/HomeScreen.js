import React, { useState, useRef, useEffect } from "react";

import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";

import {} from "react-native";

import { useUserContext } from "../../contexts/UserContext";
import { Calendar } from "react-native-calendars";
import Ggupdeagi from "../Ggupdeagi";

// 아이콘 받기위해 사용
import Icon from "react-native-vector-icons/MaterialIcons";
// 펫 정보 firebase에 저장
import { createPetInfo } from "../../lib/petInfo";
// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";
// 펫 정보 삭제를 위해 사용
import { deletePetInfo } from "../../lib/petInfo";
// 난수 생성
import { v4 as uuidv4 } from "uuid";
const uuid = uuidv4();

function HomeScreen() {
  
  const { user } = useUserContext();
  const uid = user["id"];
  const [petInfo, setPetInfo] = useState({
    petName: "",
    petAge: "",
    petWeight: "",
    petGender: "",
    petKind: "",
  });
  const [showModal, setShowModal] = useState(false);
  // 펫 정보 불러오기 위함
  const [petList, setPetList] = useState([]);

  const animation = useRef(new Animated.Value(0)).current;

  // 펫 정보 불러오기
  useEffect(() => {
    if (user) {
      getPetInfoByUserID(uid).then((pets) => {
        setPetList(pets);
      });
    }
  }, [user]);

  // 펫 정보 저장하기
  const handleSavePetInfo = () => {
    createPetInfo({ ...petInfo, userID: uid })
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
    <View style={styles.container}>
      {/* 홈화면 상단 프로필 표시 */}
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {user.photoURL && (
          <Image
            source={{ uri: user.photoURL }}
            style={{ width: 60, height: 60 }}
            resizeMode="cover"
          />
        )}
        <Text style={{ fontSize: 30, marginLeft: 10 }}>안녕하세요 {user.displayName} 님!</Text>
      </View>
      {/* 어플 요약 정보 표시 - 23.04.29 현재는 형태만 저장 */}
      <Ggupdeagi />
      <View style={styles.petListScrollView}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {petList.map((pet) => (
            <View key={pet.id} style={styles.petInfoContainer}>
              <Text style={styles.subtitle}>이름: {pet.petName}</Text>
              <Text style={styles.petInfoText}>나이 :{pet.petAge}</Text>
              <Text style={styles.petInfoText}>무게 : {pet.petWeight}</Text>
              <Text style={styles.petInfoText}>성별 : {pet.petGender}</Text>
              <Text style={styles.petInfoText}>품종 : {pet.petKind}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePet(pet.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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

            <View style = {styles.modalButtons}>
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
      {/* 펫 정보 추가 버튼 애니메이션 */}
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
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            Platform.OS === "ios" && {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          android_ripple={{ color: "white" }}
          onPress={() => {
            console.log("this button");
            setShowModal(true);

          }
        }
        >
          <Icon name="add" size={24} style={{ color: "white" }} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFA000",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 24,
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
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#E5E5E5",
    marginRight: 20,
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  petInfoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row-reverse",
    margin: 8,
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
    flexGrow: 1,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    alignItems: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: "#2E8B57",
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    width: "100%",
    paddingVertical: 2,
  },
});
//--------------------------------------------------------------------

export default HomeScreen;
