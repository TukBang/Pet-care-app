import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getPetInfo } from "../../lib/petInfo";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
// 펫 정보 삭제를 위해 사용
import { deletePetInfo } from "../../lib/petInfo";

function PetProfile({ route }) {
  const { petId } = route.params;
  const [petInfo, setPetInfo] = useState(null);
  // const formattedDate = `${year}년 ${month}월 ${day}일`;
  const navigation = useNavigation();

  const [petList, setPetList] = useState([]);

  console.log(petId);
  useEffect(() => {
    getPetInfo(petId)
      .then((pet) => {
        setPetInfo(pet);
      })
      .catch((error) => {
        console.error("펫 정보 불러오기 실패", error);
      });
  }, [petId]);
  console.log(petInfo);
  if (!petInfo) {
    return null;
  }

  // // 펫 정보 삭제하기
  const handleDeletePet = async (petId) => {
    await deletePetInfo(petId);
    const updatedPetList = petList.filter((pet) => pet.id !== petId);
    setPetList(updatedPetList);

    // 홈 화면으로 돌아가기
    navigation.goBack();
  };

  // 임의로 넣어둠 
  const goMyBoard = () => {
    navigation.navigate("CommunityScreen", { boardCategory: "내 게시물" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.petImageContainer}>
        <Image source={{uri: petInfo.petImage}}
        resizeMode="cover"
        style={styles.petImage} />
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{petInfo.petName}야 반가워</Text>
          <Text>무게 : {petInfo.petWeight}</Text>
          <Text>나이 : {petInfo.petAge}</Text>
          <Text>성별 : {petInfo.petGender}</Text>
          <Text>품종 : {petInfo.petKind}</Text>
        </View>
      </View>
      <View style={styles.border} />
        <TouchableOpacity style={styles.content} onPress={goMyBoard}>
        <Icon style={styles.icon} name="dashboard" size={30} />
        <Text style={{}}>내 게시물</Text>
      </TouchableOpacity>
      <View style={styles.border} />
      <TouchableOpacity style={styles.content} onPress={() => handleDeletePet(petId)}>
        <Icon style={[styles.icon, styles.delete]} name="delete" size={30} />
        <Text style={{}}>펫 정보 삭제</Text>
      </TouchableOpacity>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f6faff",
  },
  petImageContainer: {
    margin: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 45,
    marginRight: 10,
  },
  petName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  petInfoContainer: {
    marginLeft: 10,
  },
  petInfoText: {
    fontSize: 20,
    marginVertical: 5,
  },
  border: {
    height: 1,
    backgroundColor: "gray",
    marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 20,
    marginTop: 10,
  },
  content: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    // color: 'red',
  },
  delete: {
    color: "red",
  },
});

export default PetProfile;