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
        <Text>펫 이름 : {petName}</Text>
        <View style={styles.head}>
            <Image
                source={{ uri: petImage}}
                style={styles.image}
                resizeMethod="resize"
                resizeMode="cover"
                />
            <Image
                source={{ uri: image}}
                style={styles.image}
                resizeMethod="resize"
                resizeMode="cover"
                />
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
            <ProbChart prediction={prediction["predictions"]} />
        </View>
      </View>
      <View style={styles.border} />
    </>
  );
}
const styles = StyleSheet.create({
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
    width: "20%",
    aspectRatio: 1,
    // marginBottom: 6,
    // marginTop: 6,
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
    marginLeft: 14,
  },
});

export default React.memo(DiagResultCard);
