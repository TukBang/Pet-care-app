import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import haversine from "haversine";
import Geolocation from "@react-native-community/geolocation";
import { captureRef } from "react-native-view-shot";
import storage from "@react-native-firebase/storage";
import { v4 } from "uuid";
import RNFS from "react-native-fs";
import { useUserContext } from "../../contexts/UserContext";
import { createWalkInfo } from "../../lib/walkInfo";
import MapInfo from "./MapInfo";
import MapUploadModal from "./MapUploadModal";

const LATITUDE_DELTA = 0.009; 
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 0;
const LONGITUDE = 0;

function AnimatedMarkers  () {
  const [kcal, setKcal] = useState(0); // 칼로리
  const [latitude, setLatitude] = useState(LATITUDE); // 초기 Latitude 값
  const [longitude, setLongitude] = useState(LONGITUDE); // 초기 Longtitude 값
  const [routeCoordinates, setRouteCoordinates] = useState([]); // 다녀왔던 길을 배열 [Latitude, Longtitude]의 형태로 저장
  const [distanceTravelled, setDistanceTravelled] = useState(0); // 누적 거리
  const [prevLatLng, setPrevLatLng] = useState({}); // 이전의 Latitude, Longtitude 를 저장 -> 새로운 것과 함께 거리측정에 사용
  const [isTracking, setIsTracking] = useState(false); // 위치 기록 추적 상태
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부를 관리하는 상태 변수
  const [resultImage, setResultImage] = useState('');
  
  const {user} = useUserContext();
  const uid = user["id"];

  const coordinate = useRef(new AnimatedRegion({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));

  const markerRef = useRef(null);
  const mapRef = useRef(null);





  useEffect(()  => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude)
        console.log(longitude)

        setPrevLatLng({
          latitude: latitude,
          longitude: longitude,
        });
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
      Geolocation.setRNConfiguration({ skipPermissionRequests: true }); // iOS에서 위치 권한 요청을 스킵
    
      if(isTracking) {
        var watchID = Geolocation.watchPosition( 
          (position) => {
            const { latitude, longitude } = position.coords;

            const newCoordinate = {
              latitude,
              longitude,
            };
            // console.log(latitude)
            if (Platform.OS === "android") {
              if (markerRef.current && markerRef.current._component) {
                console.log(markerRef)
                markerRef.current._component.animateMarkerToCoordinate(newCoordinate, 500);
              }
            } else {
              coordinate.current.timing(newCoordinate).start();
            }

          console.log('newcorrdi',newCoordinate);
          setPrevLatLng(newCoordinate);
          setLatitude(latitude);
          setLongitude(longitude);
          setRouteCoordinates((prevRouteCoordinates) => [...prevRouteCoordinates, newCoordinate]);

          const distanceDelta = calcDistance(newCoordinate);
          console.log('newcorrdi',newCoordinate)
          console.log('distancedelta',distanceDelta)
          console.log('disTravel',distanceTravelled)
          const accumulateDistance = distanceTravelled + distanceDelta
          setDistanceTravelled(accumulateDistance);
          setKcal(calcKcal(accumulateDistance));
          
          },
          (error) => console.log(error),
          {
            enableHighAccuracy: true,
            interval: 250,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 5,
          },
        );
      }

    return () => {
      if(isTracking) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, [isTracking]);
    
  useEffect(() => {
    if(isTracking){
    var interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
  }
    return () => clearInterval(interval);
  }, [elapsedTime, startTime]);





  const getMapRegion = () => ({
    latitude,
    longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  // 산책 정보 저장하기
  const handleSaveWalkInfo = async () => {

    const extension = resultImage.split(".").pop();
    var reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);

    //image : path to base64 변환
    const image = await RNFS.readFile(resultImage, "base64");
    if (Platform.OS === "android") {
      await reference.putString(image, "base64", { contentType: 'png' });
    } else {
      await reference.putFile(resultImage);
    }
    const walkImage = await reference.getDownloadURL();

    createWalkInfo({ 
      time: elapsedTime, 
      distance : distanceTravelled,
      kcal : kcal,
      userID: uid, 
      walkingImage: walkImage })

  };
  
  // 모달을 숨기는 함수
  const hideModal = async () => {
    setIsModalVisible(true);
    await handleSaveWalkInfo();
    setIsModalVisible(false);
    
    // 나머지 코드들 실행
    setRouteCoordinates([]); // 위치 기록 초기화
    setDistanceTravelled(0); // 이동 거리 초기화
    setPrevLatLng(null);
    setKcal(calcKcal(0));
    setIsModalVisible(false);
    console.log(prevLatLng)
  };

  const startTracking = async() => {
    if(!isTracking) {
      setRouteCoordinates([]); // 위치 기록 초기화
      setDistanceTravelled(0); // 이동 거리 초기화
      setKcal(calcKcal(0));

      setStartTime(Date.now()); // 시작 시간 기록
      setElapsedTime(0); // 경과 시간 초기화
      setResultImage('');

      setIsTracking(true);
    };
  }

  const stopTracking = async () => {
    if (isTracking) {
      setIsTracking(false);
  
      // 여태까지의 polyline이 모두 보이도록 지도의 축적을 조정
      const coordinates = routeCoordinates.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));
      const edgePadding = { top: 50, right: 50, bottom: 50, left: 50 }; // 마커가 화면에 보이도록 여백 설정
  
      await mapRef.current.fitToCoordinates(coordinates, {
        edgePadding,
        animated: false,
      });
  
      // 지도를 사진으로 캡처하여 저장
      const result = await captureRef(mapRef, {
        format: 'png', // 저장할 이미지 포맷 설정
      });
  
      setResultImage(result);
      setIsModalVisible(true);
    }
  };

  const calcDistance = (newLatLng) => {
    const distance = haversine({ latitude: latitude, longitude: longitude },
      newLatLng) || 0;
    console.log('prevlat',prevLatLng)
    console.log('newlat',newLatLng)
    console.log('calcdistance',distance)
    return distance;
  };

  const calcKcal = (distanceDelta) => {
    const kcal = (distanceDelta / 0.1) * 7;
    return kcal;
  };




  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>산책</Text>
        <TouchableOpacity onPress={startTracking}>
          <Text>시작</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopTracking}>
          <Text>중단</Text>
        </TouchableOpacity>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={getMapRegion()}
        >
          <Polyline zIndex={5} coordinates={routeCoordinates} strokeWidth={5} strokeColor="green"/>
          <Marker.Animated
            ref={markerRef}
            coordinate={coordinate.current}
            image={require('../../assets/dog.png')}
            // pinColor='green'
          />
        </MapView>
        {/* 산책 정보 기록 Contatiner */}
        <MapInfo elapsedTime={elapsedTime} distanceTravelled={distanceTravelled} kcal={kcal}/>
        <Text>{latitude}</Text>
        <Text>{longitude}</Text>
      </View>
      <MapUploadModal isModalVisible={isModalVisible} hideModal={hideModal} resultImage={resultImage} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
  },
  container: {
    width: "100%",
    height: "70%",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  map: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
});

export default AnimatedMarkers;