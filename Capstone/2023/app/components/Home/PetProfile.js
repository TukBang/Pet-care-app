import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getPetInfoById } from "../../lib/petInfo";

function PetProfile({ route }) {
  const { petId } = route.params;
  const [petInfo, setPetInfo] = useState(null);

  useEffect(() => {
    getPetInfoById(petId)
      .then((pet) => {
        setPetInfo(pet);
      })
      .catch((error) => {
        console.error("펫 정보 불러오기 실패", error);
      });
  }, [petId]);

  if (!petInfo) {
    return null;
  }
console.log(petInfo.petName);
  return (
    <View style={styles.container}>
      <View style={styles.petImageContainer}>
        <Image source={petInfo.petImage} style={styles.petImage} />
      </View>
      <View style={styles.petInfoContainer}>
        <Text style={styles.petInfoText}>이름 : {petInfo.petName}</Text>
        <Text style={styles.petInfoText}>나이 : {petInfo.petAge}</Text>
        <Text style={styles.petInfoText}>무게 : {petInfo.petWeight}</Text>
        <Text style={styles.petInfoText}>성별 : {petInfo.petGender}</Text>
        <Text style={styles.petInfoText}>품종 : {petInfo.petKind}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  petImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  petInfoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  petInfoText: {
    fontSize: 20,
    marginVertical: 5,
  },
});

export default PetProfile;