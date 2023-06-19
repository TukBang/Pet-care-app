import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { getPetInfo } from "../../lib/petInfo";
import { deletePetInfo } from "../../lib/petInfo";

function PetProfile({ route }) {
  const { petId } = route.params;
  const [petInfo, setPetInfo] = useState(null);
  const navigation = useNavigation();
  const [petList, setPetList] = useState([]);

  console.log(petId);

  useEffect(() => {
    getPetInfo(petId).then((pet) => {
      setPetInfo(pet);
    }).catch((error) => {
      console.error("펫 정보 불러오기 실패", error);
    });
  }, [petId]);

  console.log(petInfo);

  if (!petInfo) {
    return null;
  }

  // 펫 정보 삭제하기
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
        <Image 
          source={{uri: petInfo.petImage}}
          resizeMode="cover"
          style={styles.petImage}
        />

        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{petInfo.petName}야 반가워</Text>
          <Text style={{color: "#282828"}}>나이: {petInfo.petAge}살</Text>
          <Text style={{color: "#282828"}}>성별: {petInfo.petGender}</Text>
          <Text style={{color: "#282828"}}>무게: {petInfo.petWeight}kg</Text>          
          <Text style={{color: "#282828"}}>품종: {petInfo.petKind}</Text>
        </View>
      </View>

      <View style={{width: "97%", height: "1%", left: 7}}>
        <View style={[styles.border]} />
      </View>

      <TouchableOpacity style={styles.content} onPress={() => handleDeletePet(petId)}>
        <Icon style={styles.icon} name="delete" size={30} />
        <Text style={{color: "#282828"}}>펫 정보 삭제</Text>
      </TouchableOpacity>

      <View style={{width: "97%", height: "1%", bottom: 13, left: 7}}>
        <View style={[styles.border]} />
      </View>
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
    top: 16.5,
    width: 80,
    height: 80,
    borderRadius: 45,
    marginRight: 10,
  },

  petName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#282828", 
  },

  petInfoContainer: {
    top: 2,
    marginLeft: 10,
  },

  petInfoText: {
    fontSize: 20,
    marginVertical: 5,
  },

  border: {
    height: 1,
    backgroundColor: "#C0CDDF",
    marginBottom: 10,
    marginTop: 10,
  },

  content: {
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginLeft: 10,
    marginRight: 10,
    color: "#DF3030",
  },
});

export default PetProfile;