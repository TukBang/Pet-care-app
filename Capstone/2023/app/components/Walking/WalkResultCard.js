import React, { useMemo, useEffect } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPetInfoByUserID } from "../../lib/petInfo";
import { useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

function WalkResultCard({
    walkID,
    time,
    distance,
    kcal,
    userID,
    petID,
    walkingImage, 
    createdAt 
    }) 
{

  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );
  const [petInfo, setPetInfo] = useState();
  const [filteredPet, setFilteredPet] = useState();
  

  useEffect(() => {
    getPetInfoByUserID(userID).then((_petInfo) => {
      setPetInfo(_petInfo);
      });
    if (petInfo) {
        petInfo.forEach(item => {
            if (item.id === petID) {
                setFilteredPet(item.petName); // petID와 일치하는 요소의 petName 출력
            }
          });
        // setFilteredPet(pet);
      console.log('filtered',filteredPet)  
    }
  }, [petID, userID, petInfo ? '' : petInfo]);

  return (
    <>
      <View style={{flexDirection: "row"}}>
        <View style={styles.paddingBlock}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>

            <View style={[styles.walkingBox, {justifyContent: "flex-end"}]}>
              {/* <Text>펫 이름 : {filteredPet.petName}</Text> */}
              <Text style={[styles.recordText, {marginBottom: 10, fontWeight: "bold"}]}>{filteredPet}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.recordView}>
                  <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>시간</Text>
                  {
                    time >= 60000 ? (
                      <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{((time - (time % 60000)) / 60000).toFixed(0)}분 {(time % 60000 / 1000).toFixed(0)}초</Text>
                    ) : (
                      <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{(time / 1000).toFixed(0)} 초</Text>
                    )
                  }                  
                </View>

                <View style={styles.recordView}>
                  <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>거리</Text>
                  <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{distance.toFixed(1)} km</Text>
                </View>
                <View style={styles.recordView}>
                  <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>칼로리</Text>
                  <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{kcal.toFixed(1)} kcal</Text>
                </View>
              </View>
              
              <Text date={date} style={styles.date}>{format(date, "yyyy년 MM월 dd일 hh:mm", { locale: ko })}</Text>
            </View>
          </View>
        </View>

        <View style={styles.imageView}>
          <Image
            source={{uri: walkingImage}}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={{width: "100%"}}>
        <View style={[styles.border]} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  paddingBlock: {
    paddingHorizontal: 10,
  },

  // 펫 프로필 뷰
  walkingBox:{
    width: '60%',
    marginTop: 10,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },

  border: {
    height: 1,
    marginLeft: 10,
    marginRight: 10,
    
    backgroundColor: "#C0CDDF",
  },

  recordView: {
    flexDirection: "column",
    width: "80%", 
    marginRight: 2, 
    
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: "#C0CDDF"
  },

  recordText: {
    fontSize: 14,
    color: "#282828",
  },

  date: {
    color: "#686868",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
  },

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

  // 산책된 이미지
  imageView: {
    width: "50%",
    marginRight: 10,
    marginBottom: 10,
  },

  image: {
    width: "65%",
    aspectRatio: 1.5,
    marginTop: 10,
    marginLeft: 12,
    
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C0CDDF"
  },

  text:{
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 40,
  },

  avatar: {
    width: 15,
    height: 15,
    borderRadius: 16,
    // alignSelf:'right'
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

  description: {
    fontSize: 16,
    // lineHeight: 24,
    marginLeft: 8,
  },
});

export default React.memo(WalkResultCard);
