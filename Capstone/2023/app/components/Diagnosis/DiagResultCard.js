import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProbChart from "./HorizontalBarChart";

function DiagResultCard({
     diagID, 
     userID, 
     petName, 
     petSpecies, 
     petGender, 
     petWeight, 
     petAge, 
     petID, 
     prediction, 
     petImage, 
     image, 
     createdAt }) 
     {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );
  const navigation = useNavigation();
  

  return (
    <>
      <View style={styles.paddingBlock}>
        <View style={styles.header}>
          <Image
                  source={{ uri: petImage}}
                  style={styles.image1}
                  resizeMethod="resize"
                  resizeMode="cover"
                  />
          <Text style={styles.name}>{petName}</Text>
        </View>
        <View style={styles.profile}>
          <View style={styles.petProfile}>
            <Text>펫 종류 : {petSpecies}</Text>
            <Text>펫 성별 : {petGender}</Text>
            <Text>펫 무게 : {petWeight}</Text>
            <Text>펫 나이 : {petAge}</Text>
            <Text date={date} style={styles.date}>
              {date.toLocaleString()}
            </Text>
            <View style={{flexDirection: 'column'}}>
                <Text>{prediction.predictions}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.text}>진단 사진</Text>
            <Image 
              source={{ uri: image}}
              style={styles.image}
              resizeMethod="resize"
              resizeMode="cover"
              />
          </View>
        </View>
        <ProbChart prediction={prediction["predictions"]} />
      </View>
      <View style={styles.border} />
    </>
  );
}
const styles = StyleSheet.create({
  // 펫 프로필 이미지와 펫 이름 뷰 스타일
  header: {
    flexDirection: "row",
  },

  // 펫 이름 Text 스타일
  name: {
    fontWeight: "bold",
    fontSize: 25,

    marginTop: 30,
    marginLeft: 15,
  },

  // 선택된 펫 프로필 이미지
  image1: {
    backgroundColor: "#bdbdbd",
    width: "15%",
    aspectRatio: 1,
    // marginBottom: 6,
    marginTop: 15,
    borderRadius: 50,
  },

  // 프로필 , input 사진 이미지 뷰
  profile:{
    flexDirection: "row",
    flex: 1,
  },

  // 펫 프로필 뷰
  petProfile:{
    width: '50%',
    marginTop: 10,
    
  },

  text:{
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 40,
  },

  border: {
    height: 1,
    backgroundColor: "gray",
    // marginBottom: 10,
    marginLeft: 10,
    marginRight: 20,
  },
  avatar: {
    width: 15,
    height: 15,
    borderRadius: 16,
    // alignSelf:'right'
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    // flexDirection: "row",
    marginTop: 16,
    marginBottom: 6,
    // marginBotton: 20,
    // paddingBotton: 14,
  },
  tail: {
    flexDirection: "row",
    marginBottom: 10,
  },
  profile: {
    flexDirection: "row",
    // alignItems: 'center',
  },
  displayName: {
    // lineHeight: 20,
    fontSize: 13,
    marginLeft: 3,
    fontWeight: "bold",
    justifyContent: "space-between",
  },
  boardTitle: {
    // lineHeight: 20,
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "bold",
  },
  image: {
    backgroundColor: "#bdbdbd",
    width: "65%",
    aspectRatio: 1,
    
    //marginLeft: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    // lineHeight: 24,
    marginLeft: 8,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default React.memo(DiagResultCard);
