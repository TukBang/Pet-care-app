import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE, MapStyle } from "react-native-maps";

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

var initLatitude = 35.44376;            // 이 부분은 아래 주석이 활성화되면 null으로 변경
var initLongitude = 139.63766833333332; // 이 부분은 아래 주석이 활성화되면 null으로 변경
var startLatitude = null;
var startLongitude = null;
var watchLatitude = null;
var watchLongitude = null;
var prevLatitude = null;
var prevLongitude = null;
var distanceTravelled = 0;
let count = 0;

// 이걸 활성화 시키면 어플을 키자마자 위치 접근 권한이 있어야 함
// 어플을 킬 때 권한을 키는 방법을 찾아야 함
// // 내 위치 가져오기
// Geolocation.getCurrentPosition((position) => {
//   initLatitude = JSON.parse(JSON.stringify(position.coords.latitude));
//   initLongitude = JSON.parse(JSON.stringify(position.coords.longitude));

//   // 초기 위치 출력
//   console.log("#0-----------------------------------------------------------------------------");
//   console.log("초기 위치");
//   console.log("위도:", latitude);
//   console.log("경도:", longitude);
//   console.log("");
//   console.log("#0-----------------------------------------------------------------------------");
// });

function AnimatedMarkers() {
  // 변수 부문 ----------------------------------------------------------------------------------------------------------------------------------
  // 위치 관련 useState 변수
  const [latitude, setLatitude] = useState(initLatitude);        // 위도 값
  const [longitude, setLongitude] = useState(initLongitude);     // 경도 값
  const [routeCoordinates, setRouteCoordinates] = useState([]);  // 경로 좌표 값;

  // 기록 관련 useState 변수
  const [kcal, setKcal] = useState(0);                           // 칼로리
  const [startTime, setStartTime] = useState(null);              // 시작 시간
  const [elapsedTime, setElapsedTime] = useState(0);             // 경과 시간

  // 시작 상태 및 결과 모달 관련 useState 변수
  const [isTracking, setIsTracking] = useState(false);           // 위치 기록 추적 상태 변수
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resultImage, setResultImage] = useState('');
  
  // 사용자 ID 가져오기
  const {user} = useUserContext();
  const uid = user["id"];

  // 좌표 구조체 변수 선언
  const coordinate = useRef(new AnimatedRegion({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));

  // 지도 관련 변수 초기화
  const markerRef = useRef(null); // 둘 다 안씀
  const mapRef = useRef(null);    // 둘 다 안씀
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{"color": "#f5f5f5"}]
    },
    {
      "elementType": "labels",
      "stylers": [{"visibility": "off"}]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#616161"}]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#f5f5f5"}]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#bdbdbd"}]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "poi",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{"color": "#eeeeee"}]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#757575"}]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{"color": "#e5e5e5"}]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#757575"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{"color": "#dadada"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#616161"}]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
    },
    {
      "featureType": "transit",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{"color": "#e5e5e5"}]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{"color": "#eeeeee"}]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{"color": "#c9c9c9"}]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
    }
  ];
  
  // 함수 부문 ----------------------------------------------------------------------------------------------------------------------------------
  // MapView 위치 초기화 함수
  const getMapRegion = () => ({
    latitude,
    longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const startTracking = async () => {
    if (!isTracking) {
      setRouteCoordinates([]);  // 위치 기록 초기화
      distanceTravelled = 0;    // 누적 거리 초기화
      count = 0;               // 카운트 초기화
      setKcal(0);               // 소모 칼로리 초기화
      setStartTime(Date.now()); // 시작 시간 기록
      setElapsedTime(0);        // 경과 시간 초기화
      setResultImage('');       // 결과 이미지 초기화
      setIsTracking(true);      // 트래킹 시작
    };
  }

  // 거리 계산 함수
  const calcDistance = (newLatLng) => {
    return haversine({ latitude: prevLatitude, longitude: prevLongitude }, newLatLng) || 0;
  };

  // 칼로리 계산 함수
  const calcKcal = (distanceDelta) => {return ((distanceDelta / 0.1) * 7)};

  const stopTracking = async () => {
    if (isTracking) {
      setIsTracking(false);
  
      // 여태까지의 polyline이 모두 보이도록 지도의 축적을 조정
      const coordinates = routeCoordinates.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));

      // 마커가 화면에 보이도록 여백 설정
      const edgePadding = { 
        top: 50, 
        bottom: 50, 
        left: 50,
        right: 50,
      }; 
  
      await mapRef.current.fitToCoordinates(coordinates, {
        edgePadding,
        animated: false,
      });
  
      // 지도를 사진으로 캡처하여 저장
      const result = await captureRef(mapRef, {
        format: 'png',
      });
  
      setResultImage(result);
      setIsModalVisible(true);
    }
  }; 

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
      walkingImage: walkImage
    });
  };
  
  // 모달을 숨기는 함수
  const hideModal = async () => {
    setIsModalVisible(true);
    await handleSaveWalkInfo();
    setIsModalVisible(false);
    
    // 나머지 코드들 실행
    setRouteCoordinates([]); // 위치 기록 초기화
    distanceTravelled = 0;   // 이동 거리 초기화
    prevLatitude = null;     // 이전 위도 초기화
    prevLongitude = null;    // 이전 경도 초기화
    count = 0;               // 카운트 초기화
    setKcal(0);              // 칼로리 초기화
    setIsModalVisible(false);
  };  

  // useEffect 부문 ----------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // iOS에서 위치 권한 요청을 스킵
    Geolocation.setRNConfiguration({skipPermissionRequests: true});
    
    if (isTracking) {
      // 첫 시작 때 위치를 가져옴
      Geolocation.getCurrentPosition((position) => {
        startLatitude = JSON.parse(JSON.stringify(position.coords.latitude));
        startLongitude = JSON.parse(JSON.stringify(position.coords.longitude));
        setLatitude(startLatitude);
        setLongitude(startLongitude);
      }, (error) => {console.log(error);});

      // Tracking 시작
      var watchID = Geolocation.watchPosition((position) => {
        count += 1;
        watchLatitude = JSON.parse(JSON.stringify(position.coords.latitude));
        watchLongitude = JSON.parse(JSON.stringify(position.coords.longitude));
        
        var newCoordinate = {
          latitude: watchLatitude,
          longitude: watchLongitude,
        };
        
        setRouteCoordinates((prevRouteCoordinates) => [...prevRouteCoordinates, newCoordinate]);
        setLatitude(watchLatitude);
        setLongitude(watchLongitude);

        if (count < 2) {
          prevLatitude = watchLatitude;
          prevLongitude = watchLongitude;
        }
        else {
          const distanceDelta = calcDistance(newCoordinate);
          distanceTravelled += distanceDelta
          setKcal(calcKcal(distanceTravelled));

          prevLatitude = watchLatitude;
          prevLongitude = watchLongitude;
        }
      }, (error) => console.log(error), {
        enableHighAccuracy: true,
        interval: 10,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 5,
      });
    }

    return () => {
      if (isTracking) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, [isTracking]);
    
  useEffect(() => {
    if (isTracking) {
      var interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [elapsedTime, startTime]);

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
          customMapStyle={mapStyle}
        >
          <Polyline zIndex={5} coordinates={routeCoordinates} strokeWidth={5} strokeColor="green"/>
          <Marker.Animated
            ref={markerRef}
            coordinate={coordinate.current}
            image
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