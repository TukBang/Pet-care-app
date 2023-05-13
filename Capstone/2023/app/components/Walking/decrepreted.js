// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */
// navigator.geolocation = require("@react-native-community/geolocation");

// import React from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   PermissionsAndroid,
//   Button,
// } from "react-native";
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
// import haversine from "haversine";

// import Geolocation from "@react-native-community/geolocation";

// // const LATITUDE = 29.95539;
// // const LONGITUDE = 78.07513;
// const LATITUDE_DELTA = 0.009;
// const LONGITUDE_DELTA = 0.009;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;

// class AnimatedMarkers extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       mode: "wait",
//       kcal: 0,
//       latitude: LATITUDE,
//       longitude: LONGITUDE,
//       routeCoordinates: [],
//       distanceTravelled: 0,
//       prevLatLng: {},
//       coordinate: new AnimatedRegion({
//         latitude: LATITUDE,
//         longitude: LONGITUDE,
//         latitudeDelta: 0,
//         longitudeDelta: 0,
//       }),
//     };

//     // Marker 초기화
//     this.marker = [];
//   }

//   componentDidMount() {
//     const { coordinate } = this.state;

//     this.watchID = Geolocation.watchPosition(
//       (position) => {
//         const { routeCoordinates, distanceTravelled } = this.state;
//         const { latitude, longitude } = position.coords;

//         const newCoordinate = {
//           latitude,
//           longitude,
//         };

//         if (Platform.OS === "android") {
//           if (this.marker && this.marker._component) {
//             this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
//           }
//         } else {
//           coordinate.timing(newCoordinate).start();
//         }

//         this.setState({
//           latitude,
//           longitude,
//           routeCoordinates: routeCoordinates.concat([newCoordinate]),
//           distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
//           kcal: this.calcKcal(distanceTravelled), //칼로리 계산
//           prevLatLng: newCoordinate,
//         });
//       },
//       (error) => console.log(error),
//       {
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 1000,
//         distanceFilter: 10,
//       }
//     );
//   }

//   componentWillUnmount() {
//     Geolocation.clearWatch(this.watchID);
//   }

//   //현재위치
//   getMapRegion = () => ({
//     latitude: this.state.latitude,
//     longitude: this.state.longitude,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });

//   //거리 계산
//   calcDistance = (newLatLng) => {
//     const { prevLatLng } = this.state;
//     return haversine(prevLatLng, newLatLng) || 0;
//   };
//   calcKcal = (distanceDelta) => {
//     // 이동한 거리를 이용해 kcal 계산해주는 함수. 0.1m당 7kcal로 계산함.
//     return (distanceDelta / 0.1) * 7;
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.header}>산책</Text>
//         <MapView
//           style={styles.map}
//           provider={PROVIDER_GOOGLE}
//           showUserLocation
//           followUserLocation
//           loadingEnabled
//           region={this.getMapRegion()}>
//           <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
//           <Marker.Animated
//             ref={(marker) => {
//               this.marker = marker;
//             }}
//             coordinate={this.state.coordinate}
//           />
//         </MapView>
//         {/* 산책 정보 기록 Contatiner */}
//         <View style={styles.infoContainer}>
//           <Text>걸린 시간{"\n"}</Text>
//           <View style={styles.border} />
//           <Text>
//             이동한 거리{"\n"}
//             {parseFloat(this.state.distanceTravelled).toFixed(2)} km
//           </Text>
//           <View style={styles.border} />
//           <Text>
//             소모된 칼로리{"\n"}
//             {parseFloat(this.state.kcal).toFixed(2)} kcal
//           </Text>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 25,
//   },
//   container: {
//     // ...StyleSheet.absoluteFillObject,
//     width: "100%",
//     height: "70%",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-end",
//   },
//   infoContainer: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "stretch",
//     justifyContent: "space-between",
//     margin: 10,
//   },
//   bubble: {
//     flex: 1,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 20,
//   },
//   latlng: {
//     width: 200,
//     alignItems: "stretch",
//   },
//   button: {
//     width: 80,
//     paddingHorizontal: 12,
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginVertical: 20,
//     backgroundColor: "transparent",
//   },
//   distanceContainer: {
//     position: "absolute",
//     bottom: 20,
//     left: 10,
//     right: 10,
//   },
//   border: {
//     width: 1,
//     height: "100%",
//     backgroundColor: "gray",
//     // marginBottom: 10,
//     // marginLeft: 10,
//     // marginRight: 20,
//     // marginTop: 10,
//   },
// });

// export default AnimatedMarkers;
