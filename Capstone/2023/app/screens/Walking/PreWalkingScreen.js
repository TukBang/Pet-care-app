import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";

const PreWalkingScreen = ({onPress}) => {
  const [walkingStart, setWalkingStart] = useState(false);
  const [isWalked, setIsWalked] = useState(false);

  // 펫 정보 불러오기 위함
  const [petList, setPetList] = useState([]);

  // user uid 를 위해 사용
  const { user } = useUserContext();
  const uid = user["id"];

  // 버튼을 눌렀을 때, 함수
  const [isPressed, setIsPressed] = useState(null);
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

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/google-maps-blur.png')} style={styles.backgroundImage} />
      <Text style={styles.header}>함께 산책하기</Text>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {petList.map((pet) => (
          <TouchableOpacity 
            key={pet.id} 
            //onPress={() => handlePressPet(pet.id)} 
            style={[styles.petListContainer ,isPressed ? styles.buttonPressed : null]}>
            <View style={styles.petInfoContainer}>
              <Image source={pet.petImage ? { uri: pet.petImage } : require("../../assets/dog.png")} style={styles.petImage} />
              <Text style={styles.petText}>{pet.petName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.box}>
        <Text style={styles.boxText}>여기 이전 산책 기록 보여주면 좋을거 같아</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => onPress()} style={styles.Boxstyles}>         
          <Text style={styles.textStyle}>산책 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 
  header:{
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 20,
    color: 'black',
  },

  // 버튼
  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 330,
    borderRadius: 5,
  },

  // 스크롤 뷰
  scrollViewContent: {
    flexDirection: "row",
    marginLeft: 10,
    elevation: 10,
    marginBottom: 30,
  },
  petInfoContainer: {
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 5,
    marginTop: 5,
    marginRight: 5,
    alignSelf: 'center',
  },
  petText:{
    fontSize: 20,
    fontWeight: "bold",
    color: 'black',
  },

  buttonContainer:{
    alignItems: 'center',
    
  },

  Boxstyles: {
    width: 250,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#3B8DF8",
    alignItems: 'center',
    padding: 15,
    elevation:10,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    height: '105%',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
  },

  box:{
    width: 380,
    height: 200,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 10,
    marginBottom: 30,
    borderRadius: 15,
  },

  boxText:{
    fontSize: 15,
    fontWeight: "bold",
    color: 'black',
  }

})

export default PreWalkingScreen;