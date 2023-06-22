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

  const {lagi, logi, setLagi, setLogi} = useUserContext();
  const [weatherData, setWeatherData] = useState(null);
  const appId = 'a410fd86af4308c1b5eb8adf787879b3';
  const lang = 'kr';
  const metric = 'metric';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const fetch_site = `https://api.openweathermap.org/data/2.5/onecall?lat=${lagi}&lon=${logi}&exclude=alerts&appid=${appId}&lang=${lang}&units=${metric}`
        console.log(fetch_site)
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
          console.log('lat',latitude)
          console.log('position',position)
          setLagi(latitude);
          setLogi(longitude);
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 10000 }
      );
    };
    
   
    // fetchWeatherData();
     // 1분마다 fetchWeatherData 함수 호출
    const interval = setInterval(() => {
      getCurrentLocation();
      fetchWeatherData();
    }, 2000); // 1분(60,000밀리초) 주기로 호출

    // Clean-up 함수에서 interval을 클리어해야 합니다.
    return () => clearInterval(interval);
  }, [lagi, lang]);


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
            <Text style={{marginTop: 45, fontSize: 18, fontWeight: "bold", color: "#282828",}}>날씨 정보를 가져오는 중...</Text>
          )}
        </View>
        
        {
          petList.length === 0 ? (
            <Text style={styles.header}></Text>
          ) : (
            <Text style={styles.header}>함께 산책하기</Text>
          )
        }
        

        <View style={{marginBottom: 45}}>
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
                    <Text 
                      style={[styles.petText, selectedPet === pet.id && styles.selectedPetText]}
                    >{pet.petName}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <TouchableOpacity 
          style={[styles.Boxstyles, !selectedPet && styles.disabledButton]}
          disabled={!selectedPet}
          onPress={onPress}
        >
          {
            petList.length === 0 ? (
              <Text style={styles.textStyle}>{selectedPet ? '산책 시작' : '펫을 등록해주세요'}</Text>
            ) : (
              <Text style={styles.textStyle}>{selectedPet ? '산책 시작' : '펫을 선택해주세요'}</Text>
            )
          }
        </TouchableOpacity>

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

  box:{
    width: "100%",
    height: "18%",
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 50,

    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#C0CDDF",
    backgroundColor: "#C0CDDF",
  },

  // 스크롤 뷰
  scrollViewContent: {
    flexDirection: "row",
    right: 5,
  },

  header:{
    alignSelf: "center",
    
    fontSize: 24,
    fontWeight: "bold",
    color: "#282828",
  },

  petListContainer: {
    alignItems: 'center',
    width: 135,
  },
  
  blurContainer: {
    opacity: 0.3, // 흐릿한 효과를 위한 투명도 조절
  },

  petText:{
    alignSelf: "center",

    fontSize: 16,
    fontWeight: "bold",
    color: "#282828",
  },

  petInfoContainer: {
    paddingLeft: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  petImage: {
    width: 125,
    height: 125,
    borderWidth: 1,
    borderColor: "#E2E6EB",
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },

  Boxstyles: {
    alignSelf: 'center',
    width: "100%",
    height: "8%",
    marginTop: 10,
    
    borderRadius: 5,
    backgroundColor: "#3B8DF8",

    padding: 15,
    elevation: 2,
  },

  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  
  textStyle: {
    alignSelf: "center",

    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
  },
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