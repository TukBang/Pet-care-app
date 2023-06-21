import React, { useState, useRef, useEffect } from "react";
import { View,
         Text,
         TouchableOpacity, 
         StyleSheet, 
         ScrollView, 
         Image, 
         TouchableWithoutFeedback, 
         PermissionsAndroid } from "react-native";
import { useUserContext } from "../../contexts/UserContext";

import Geolocation from "@react-native-community/geolocation";

// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";
import LinearGradient from 'react-native-linear-gradient';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PreWalkingScreen = ({ onPress, selectedPet, setSelectedPet }) => {
  const [petList, setPetList] = useState([]);
  const { user } = useUserContext();
  const uid = user["id"];

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const appId = 'a410fd86af4308c1b5eb8adf787879b3';
  const lang = 'kr';
  const metric = 'metric';

  // const fetch_site = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${appId}&lang=${lang}&units=${metric}`
  // const response = fetch(fetch_site);

  useEffect(() => {

    const fetchWeatherData = async () => {
      try {
        const fetch_site = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${appId}&lang=${lang}&units=${metric}`
        const response = await fetch(fetch_site);
        if (response) {
          const data = await response.json();
          console.log(data)
          setWeatherData(data.current);
          console.log('weather',weatherData)
        } else {
          throw new Error('날씨 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 500000, maximumAge: 10000 }
      );
    };
    
    getCurrentLocation();
    fetchWeatherData();
  }, [latitude, longitude, weatherData ? '': weatherData]);


  useEffect(() => {
    if (user) {
      getPetInfoByUserID(uid)
        .then((pets) => {
          const sortedPets = pets.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : 0;
            const dateB = b.createdAt ? b.createdAt.toDate() : 0;
            return dateA - dateB;
          });

          setPetList(sortedPets);
        })
        .catch((error) => console.error("펫 정보 불러오기 실패", error));
    }
  }, [user]);

  const handlePressPet = (petId) => {
    setSelectedPet((prevPet) => (prevPet === petId ? null : petId));
  };

  return (
    <LinearGradient
      colors={['#f6faff', '#f6faff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.container}>
        <View style={styles.box}>
          {weatherData ? (
            <>
              <View style={weatherStyles.weatherBox}>
                <Image 
                  style={weatherStyles.icon} 
                  source={{uri: 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon+'@2x.png'}} 
                />
                <Text style={weatherStyles.weatherText}>{weatherData.temp.toFixed(1)}º</Text>
              </View>
              <Text style={weatherStyles.weatherSubText}>{weatherData.weather[0].description}</Text>
              <Text style={[weatherStyles.weatherSubText, {fontSize: 16, }]}>체감 {weatherData.feels_like}º 습도 {weatherData.humidity}%</Text>
            </>
          ) : (
            <Text>날씨 정보를 가져오는 중...</Text>
          )}
        </View>
        <Text style={styles.header}>함께 산책하기</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {petList.map((pet) => (
            <View
              key={pet.id}
              style={[
                styles.petListContainer,
                selectedPet !== pet.id && styles.blurContainer,
                selectedPet === pet.id && styles.selectedPetContainer,
              ]}
            >
              <TouchableWithoutFeedback onPressIn={() => handlePressPet(pet.id)}>
                <View style={styles.petInfoContainer}>
                  <Image
                    source={pet.petImage ? { uri: pet.petImage } : require("../../assets/dog.png")}
                    style={styles.petImage}
                  />
                  <Text style={[styles.petText, selectedPet === pet.id && styles.selectedPetText]}>{pet.petName}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity disabled={!selectedPet} onPress={onPress} style={[styles.Boxstyles,!selectedPet && styles.disabledButton]}>
            <Text style={styles.textStyle}>{selectedPet ? '산책 시작' : '펫을 선택해주세요'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
  },

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
    marginBottom: 20,
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
    width: "100%",
    height: "18%",
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,

    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#C0CDDF",
    backgroundColor: "#C0CDDF",
  },

  boxText:{
    fontSize: 15,
    fontWeight: "bold",
    color: 'black',
  },

  petListContainer: {
    width: 200,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  blurContainer: {
    opacity: 0.3, // 흐릿한 효과를 위한 투명도 조절
  },

  disabledButton: {
    width: 250,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#D3D3D3",
    alignItems: 'center',
    padding: 15,
    elevation:10,
  }
})

const weatherStyles = StyleSheet.create({
  icon: {
    width: "20%",
    height:"100%",
  },

  weatherBox: {
    flexDirection: "row", 
    width: "100%", 
    height: "50%", 
    justifyContent: "center"
  },

  weatherText: {
    alignSelf: 'center',
    right: 5, 
    bottom: 1, 
    
    fontSize: 25,
    fontWeight: "bold",
    color: "#282828",
  },

  weatherSubText: {
    bottom: 6,

    fontSize: 20,
    color: "#282828",
  },
})

export default PreWalkingScreen;