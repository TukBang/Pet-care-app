import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import haversine from "haversine";

import Geolocation from "@react-native-community/geolocation";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

function AnimatedMarkers  () {
  const [mode, setMode] = useState("wait");
  const [kcal, setKcal] = useState(0);
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] = useState(LONGITUDE);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState({});
  const coordinate = useRef(new AnimatedRegion({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));
  const markerRef = useRef(null);

  useEffect(() => {
    Geolocation.setRNConfiguration({ skipPermissionRequests: true }); // iOS에서 위치 권한 요청을 스킵

    const watchID = Geolocation.watchPosition(
      (position) => {
        // const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };

        if (Platform.OS === "android") {
          if (markerRef.current && markerRef.current._component) {
            markerRef.current._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.current.timing(newCoordinate).start();
        }

        setLatitude(latitude);
        setLongitude(longitude);
        // setRouteCoordinates([...routeCoordinates, newCoordinate]);
        setRouteCoordinates((prevRouteCoordinates) => [...prevRouteCoordinates, newCoordinate]);
        setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate));
        // setDistanceTravelled((prevDistanceTravelled) => {
        //   const newDistance = prevDistanceTravelled + calcDistance(newCoordinate);
        //   return newDistance;
        // });
        setKcal(calcKcal(distanceTravelled));
        setPrevLatLng(newCoordinate);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );

    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, [distanceTravelled]);

  const getMapRegion = () => ({
    latitude,
    longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const calcDistance = (newLatLng) => {
    return haversine(prevLatLng, newLatLng) || 0;
  };

  const calcKcal = (distanceDelta) => {
    return (distanceDelta / 0.1) * 7;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>산책</Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showUserLocation
        followUserLocation
        loadingEnabled
        region={getMapRegion()}
      >
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate.current}
        />
        </MapView>
  {/* 산책 정보 기록 Contatiner */}
  <View style={styles.infoContainer}>
    <Text>걸린 시간{"\n"}</Text>
    <View style={styles.border} />
    <Text>
      이동한 거리{"\n"}
      {parseFloat(distanceTravelled).toFixed(2)} km
    </Text>
    <View style={styles.border} />
    <Text>
      소모된 칼로리{"\n"}
      {parseFloat(kcal).toFixed(2)} kcal
    </Text>
  </View>
  <Text>{latitude}</Text>
  <Text>{longitude}</Text>
  <Text>{calcDistance(coordinate)}</Text>
</View>

);
};

const styles = StyleSheet.create({
header: {
fontSize: 25,
},
container: {
width: "100%",
height: "70%",
justifyContent: "flex-end",
alignItems: "center",
paddingLeft: 20,
paddingRight: 20,
},
map: {
width: "100%",
height: "100%",
justifyContent: "flex-end",
},
infoContainer: {
width: "100%",
flexDirection: "row",
alignItems: "stretch",
justifyContent: "space-between",
margin: 10,
},
border: {
width: 1,
height: "100%",
backgroundColor: "gray",
},
});

export default AnimatedMarkers;